const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', [
  auth,
  body('restaurantId').isMongoId().withMessage('Valid restaurant ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.menuItem').isMongoId().withMessage('Valid menu item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress').isObject().withMessage('Delivery address is required'),
  body('paymentMethod.type').isIn(['card', 'mobile_money', 'cash_on_delivery']).withMessage('Valid payment method is required'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { restaurantId, items, deliveryAddress, paymentMethod, notes, promoCode } = req.body;

    // Validate menu items and calculate prices
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Menu item ${item.menuItem} is not available`
        });
      }

      // Calculate item total with customizations
      let itemTotal = menuItem.price * item.quantity;
      
      if (item.customizations && item.customizations.length > 0) {
        for (const customization of item.customizations) {
          const customizationData = menuItem.customizations.find(c => 
            c._id.toString() === customization.customizationId
          );
          
          if (customizationData) {
            for (const optionId of customization.optionIds) {
              const option = customizationData.options.find(o => 
                o._id.toString() === optionId
              );
              if (option) {
                itemTotal += option.price * item.quantity;
              }
            }
          }
        }
      }

      subtotal += itemTotal;

      validatedItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        customizations: item.customizations || [],
        totalPrice: itemTotal
      });
    }

    // Calculate delivery fee and tax (simplified)
    const deliveryFee = 2.99; // This should come from restaurant data
    const tax = subtotal * 0.08; // 8% tax rate
    const discount = 0; // TODO: Calculate promo code discount
    const total = subtotal + deliveryFee + tax - discount;

    // Calculate loyalty points
    const loyaltyPointsEarned = Math.floor(total);
    const loyaltyPointsUsed = 0; // TODO: Handle loyalty points usage

    // Create order
    const order = new Order({
      userId: req.user.userId,
      restaurantId,
      items: validatedItems,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      paymentMethod,
      deliveryAddress,
      estimatedDeliveryTime: '30-40 min', // This should be calculated
      notes,
      promoCode,
      loyaltyPointsEarned,
      loyaltyPointsUsed
    });

    await order.save();

    // Update user's loyalty points
    const user = await User.findById(req.user.userId);
    user.loyaltyPoints += loyaltyPointsEarned;
    await user.save();

    // Populate order data for response
    await order.populate([
      { path: 'restaurantId', select: 'name image' },
      { path: 'items.menuItem', select: 'name price image' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', [
  auth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId: req.user.userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('restaurantId', 'name image')
      .populate('items.menuItem', 'name price image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('restaurantId', 'name image address phone')
      .populate('items.menuItem', 'name price image description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order
    if (order.userId._id.toString() !== req.user.userId && 
        req.user.role !== 'restaurant_owner' && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Restaurant Owner, Admin)
router.put('/:id/status', [
  auth,
  authorize('restaurant_owner', 'admin'),
  body('status').isIn(['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'])
    .withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order's restaurant
    if (req.user.role !== 'admin' && order.restaurantId.toString() !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedOrder = await order.updateStatus(status);

    // Emit real-time update via Socket.IO
    // This would be handled in the main server file
    // io.to(`order-${order._id}`).emit('order-status-changed', {
    //   orderId: order._id,
    //   status,
    //   timestamp: new Date().toISOString()
    // });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

// @route   GET /api/orders/restaurant/:restaurantId
// @desc    Get restaurant's orders
// @access  Private (Restaurant Owner, Admin)
router.get('/restaurant/:restaurantId', [
  auth,
  authorize('restaurant_owner', 'admin'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { restaurantId } = req.params;

    // Check if user has access to this restaurant
    if (req.user.role !== 'admin') {
      // TODO: Verify user owns this restaurant
    }

    const query = { restaurantId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get restaurant orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurant orders'
    });
  }
});

module.exports = router;
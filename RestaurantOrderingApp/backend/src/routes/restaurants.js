const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/restaurants
// @desc    Get all restaurants with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('search').optional().trim(),
  query('cuisine').optional().trim(),
  query('sortBy').optional().isIn(['rating', 'deliveryTime', 'deliveryFee', 'name']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('lat').optional().isFloat().withMessage('Latitude must be a number'),
  query('lng').optional().isFloat().withMessage('Longitude must be a number'),
  query('radius').optional().isFloat({ min: 0 }).withMessage('Radius must be a positive number')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      search,
      cuisine,
      sortBy = 'rating',
      sortOrder = 'desc',
      lat,
      lng,
      radius = 10
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisine: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Cuisine filter
    if (cuisine) {
      query.cuisine = { $in: [new RegExp(cuisine, 'i')] };
    }

    // Location-based filtering
    if (lat && lng) {
      query.coordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const restaurants = await Restaurant.find(query)
      .populate('ownerId', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Restaurant.countDocuments(query);

    // Calculate distance if coordinates provided
    if (lat && lng) {
      restaurants.forEach(restaurant => {
        restaurant.distance = restaurant.calculateDistance(parseFloat(lat), parseFloat(lng));
      });
    }

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurants'
    });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('ownerId', 'name email phone')
      .populate('menu', 'name price image category isAvailable');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (!restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not available'
      });
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurant'
    });
  }
});

// @route   GET /api/restaurants/:id/menu
// @desc    Get restaurant menu
// @access  Public
router.get('/:id/menu', async (req, res) => {
  try {
    const { category } = req.query;
    
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    let menuQuery = {
      restaurantId: req.params.id,
      isAvailable: true,
      isActive: true
    };

    if (category) {
      menuQuery.category = new RegExp(category, 'i');
    }

    const menuItems = await MenuItem.find(menuQuery)
      .sort({ order: 1, name: 1 });

    // Get categories
    const categories = await MenuItem.distinct('category', {
      restaurantId: req.params.id,
      isAvailable: true,
      isActive: true
    });

    res.json({
      success: true,
      data: {
        menuItems,
        categories
      }
    });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu'
    });
  }
});

// @route   POST /api/restaurants
// @desc    Create new restaurant
// @access  Private (Restaurant Owner)
router.post('/', [
  auth,
  authorize('restaurant_owner', 'admin'),
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('cuisine').isArray({ min: 1 }).withMessage('At least one cuisine type is required'),
  body('deliveryTime').trim().notEmpty().withMessage('Delivery time is required'),
  body('deliveryFee').isFloat({ min: 0 }).withMessage('Delivery fee must be a positive number'),
  body('minimumOrder').isFloat({ min: 0 }).withMessage('Minimum order must be a positive number'),
  body('image').isURL().withMessage('Valid image URL is required'),
  body('coverImage').isURL().withMessage('Valid cover image URL is required'),
  body('address').isObject().withMessage('Address is required'),
  body('coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  body('openingHours').isArray({ min: 7 }).withMessage('All 7 days opening hours are required'),
  body('features').isArray({ min: 1 }).withMessage('At least one feature is required')
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

    const restaurantData = {
      ...req.body,
      ownerId: req.user.userId
    };

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating restaurant'
    });
  }
});

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant
// @access  Private (Restaurant Owner)
router.put('/:id', [
  auth,
  authorize('restaurant_owner', 'admin'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('deliveryTime').optional().trim().notEmpty().withMessage('Delivery time is required'),
  body('deliveryFee').optional().isFloat({ min: 0 }).withMessage('Delivery fee must be a positive number'),
  body('minimumOrder').optional().isFloat({ min: 0 }).withMessage('Minimum order must be a positive number'),
  body('isOpen').optional().isBoolean().withMessage('isOpen must be a boolean')
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

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && restaurant.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own restaurant.'
      });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: updatedRestaurant
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating restaurant'
    });
  }
});

// @route   DELETE /api/restaurants/:id
// @desc    Delete restaurant
// @access  Private (Restaurant Owner, Admin)
router.delete('/:id', [
  auth,
  authorize('restaurant_owner', 'admin')
], async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && restaurant.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own restaurant.'
      });
    }

    // Soft delete
    restaurant.isActive = false;
    await restaurant.save();

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting restaurant'
    });
  }
});

module.exports = router;
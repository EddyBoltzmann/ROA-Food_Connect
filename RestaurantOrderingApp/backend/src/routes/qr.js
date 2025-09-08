const express = require('express');
const { body } = require('express-validator');
const QRCode = require('qrcode');
const Restaurant = require('../models/Restaurant');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/qr/restaurant/:restaurantId
// @desc    Generate QR code for restaurant
// @access  Private (Restaurant Owner, Admin)
router.get('/restaurant/:restaurantId', [
  auth,
  authorize('restaurant_owner', 'admin')
], async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { tableNumber } = req.query;

    const restaurant = await Restaurant.findById(restaurantId);
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
        message: 'Access denied'
      });
    }

    // Generate QR code data
    const qrData = {
      restaurantId,
      tableNumber: tableNumber || null,
      type: tableNumber ? 'table' : 'restaurant',
      timestamp: new Date().toISOString()
    };

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Save QR code to restaurant if not table-specific
    if (!tableNumber) {
      restaurant.qrCode = qrCodeDataURL;
      await restaurant.save();
    }

    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        qrData,
        restaurant: {
          id: restaurant._id,
          name: restaurant.name
        }
      }
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating QR code'
    });
  }
});

// @route   POST /api/qr/scan
// @desc    Process QR code scan
// @access  Public
router.post('/scan', [
  body('qrData').notEmpty().withMessage('QR data is required')
], async (req, res) => {
  try {
    const { qrData } = req.body;

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code data'
      });
    }

    const { restaurantId, tableNumber, type } = parsedData;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code: Restaurant ID missing'
      });
    }

    const restaurant = await Restaurant.findById(restaurantId)
      .populate('menu', 'name price image category isAvailable');

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found or not available'
      });
    }

    res.json({
      success: true,
      data: {
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          description: restaurant.description,
          image: restaurant.image,
          coverImage: restaurant.coverImage,
          cuisine: restaurant.cuisine,
          rating: restaurant.rating,
          reviewCount: restaurant.reviewCount,
          deliveryTime: restaurant.deliveryTime,
          deliveryFee: restaurant.deliveryFee,
          minimumOrder: restaurant.minimumOrder,
          isOpen: restaurant.isCurrentlyOpen(),
          menu: restaurant.menu
        },
        tableNumber,
        type,
        deepLink: `foodconnect://restaurant/${restaurantId}${tableNumber ? `?table=${tableNumber}` : ''}`
      }
    });
  } catch (error) {
    console.error('Process QR scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing QR scan'
    });
  }
});

// @route   GET /api/qr/restaurant/:restaurantId/download
// @desc    Download QR code as PNG
// @access  Private (Restaurant Owner, Admin)
router.get('/restaurant/:restaurantId/download', [
  auth,
  authorize('restaurant_owner', 'admin')
], async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { tableNumber } = req.query;

    const restaurant = await Restaurant.findById(restaurantId);
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
        message: 'Access denied'
      });
    }

    // Generate QR code data
    const qrData = {
      restaurantId,
      tableNumber: tableNumber || null,
      type: tableNumber ? 'table' : 'restaurant',
      timestamp: new Date().toISOString()
    };

    // Generate QR code as PNG buffer
    const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(qrData), {
      width: 500,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    const filename = tableNumber 
      ? `qr-${restaurant.name}-table-${tableNumber}.png`
      : `qr-${restaurant.name}.png`;

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': qrCodeBuffer.length
    });

    res.send(qrCodeBuffer);
  } catch (error) {
    console.error('Download QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while downloading QR code'
    });
  }
});

module.exports = router;
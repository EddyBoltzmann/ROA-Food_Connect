const express = require('express');
const { body, query, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/loyalty/points
// @desc    Get user's loyalty points
// @access  Private
router.get('/points', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        points: user.loyaltyPoints,
        level: Math.floor(user.loyaltyPoints / 100), // Simple level calculation
        nextLevelPoints: Math.ceil(user.loyaltyPoints / 100) * 100 - user.loyaltyPoints
      }
    });
  } catch (error) {
    console.error('Get loyalty points error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching loyalty points'
    });
  }
});

// @route   GET /api/loyalty/rewards
// @desc    Get available loyalty rewards
// @access  Public
router.get('/rewards', async (req, res) => {
  try {
    // TODO: Implement loyalty rewards model
    // For now, return mock data
    const rewards = [
      {
        id: '1',
        name: '10% Off Next Order',
        description: 'Get 10% discount on your next order',
        pointsRequired: 100,
        discountType: 'percentage',
        discountValue: 10,
        isActive: true
      },
      {
        id: '2',
        name: '$5 Off',
        description: 'Get $5 off your order',
        pointsRequired: 200,
        discountType: 'fixed',
        discountValue: 5,
        isActive: true
      },
      {
        id: '3',
        name: 'Free Delivery',
        description: 'Free delivery on your next order',
        pointsRequired: 150,
        discountType: 'fixed',
        discountValue: 3.99,
        isActive: true
      }
    ];

    res.json({
      success: true,
      data: rewards
    });
  } catch (error) {
    console.error('Get loyalty rewards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching loyalty rewards'
    });
  }
});

// @route   POST /api/loyalty/redeem
// @desc    Redeem loyalty reward
// @access  Private
router.post('/redeem', [
  auth,
  body('rewardId').notEmpty().withMessage('Reward ID is required'),
  body('orderId').optional().isMongoId().withMessage('Valid order ID is required')
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

    const { rewardId, orderId } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // TODO: Implement loyalty rewards model and redemption logic
    // For now, return mock response
    const mockReward = {
      id: rewardId,
      pointsRequired: 100,
      discountType: 'percentage',
      discountValue: 10
    };

    if (user.loyaltyPoints < mockReward.pointsRequired) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient loyalty points'
      });
    }

    // Deduct points
    user.loyaltyPoints -= mockReward.pointsRequired;
    await user.save();

    res.json({
      success: true,
      message: 'Reward redeemed successfully',
      data: {
        rewardId,
        pointsUsed: mockReward.pointsRequired,
        remainingPoints: user.loyaltyPoints
      }
    });
  } catch (error) {
    console.error('Redeem loyalty reward error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while redeeming reward'
    });
  }
});

// @route   GET /api/loyalty/history
// @desc    Get user's loyalty points history
// @access  Private
router.get('/history', [
  auth,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // TODO: Implement loyalty points history model
    // For now, return mock data
    const history = [
      {
        id: '1',
        type: 'earned',
        points: 25,
        description: 'Order #12345',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'redeemed',
        points: -100,
        description: '10% Off Next Order',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    res.json({
      success: true,
      data: history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: history.length,
        totalPages: Math.ceil(history.length / limit)
      }
    });
  } catch (error) {
    console.error('Get loyalty history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching loyalty history'
    });
  }
});

module.exports = router;
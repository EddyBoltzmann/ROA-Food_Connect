const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/chat/:orderId/messages
// @desc    Get chat messages for an order
// @access  Private
router.get('/:orderId/messages', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user has access to this order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order
    if (order.userId.toString() !== req.user.userId && 
        req.user.role !== 'restaurant_owner' && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // TODO: Implement chat messages model and retrieval
    // For now, return empty array
    const messages = [];

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: messages.length,
        totalPages: Math.ceil(messages.length / limit)
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chat messages'
    });
  }
});

// @route   POST /api/chat/:orderId/messages
// @desc    Send a chat message
// @access  Private
router.post('/:orderId/messages', [
  auth,
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be between 1 and 500 characters'),
  body('type').optional().isIn(['text', 'image', 'system']).withMessage('Invalid message type')
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

    const { orderId } = req.params;
    const { message, type = 'text' } = req.body;

    // Verify user has access to this order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order
    if (order.userId.toString() !== req.user.userId && 
        req.user.role !== 'restaurant_owner' && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Determine sender type
    const senderType = order.userId.toString() === req.user.userId ? 'customer' : 'chef';

    // TODO: Implement chat message model and save message
    const chatMessage = {
      id: Date.now().toString(),
      orderId,
      senderId: req.user.userId,
      senderType,
      message,
      type,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // TODO: Emit real-time message via Socket.IO
    // This would be handled in the main server file

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: chatMessage
    });
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
});

// @route   PUT /api/chat/:orderId/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/:orderId/messages/:messageId/read', auth, async (req, res) => {
  try {
    const { orderId, messageId } = req.params;

    // Verify user has access to this order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order
    if (order.userId.toString() !== req.user.userId && 
        req.user.role !== 'restaurant_owner' && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // TODO: Implement mark message as read functionality
    // For now, return success

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking message as read'
    });
  }
});

module.exports = router;
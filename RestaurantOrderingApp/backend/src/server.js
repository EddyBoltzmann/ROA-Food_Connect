const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');
const chatRoutes = require('./routes/chat');
const loyaltyRoutes = require('./routes/loyalty');
const qrRoutes = require('./routes/qr');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-ordering', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/qr', qrRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join order room for real-time updates
  socket.on('join-order', (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`User ${socket.id} joined order room: order-${orderId}`);
  });

  // Leave order room
  socket.on('leave-order', (orderId) => {
    socket.leave(`order-${orderId}`);
    console.log(`User ${socket.id} left order room: order-${orderId}`);
  });

  // Chat message handling
  socket.on('send-message', (data) => {
    const { orderId, message, senderId, senderType } = data;
    
    // Broadcast message to all users in the order room
    io.to(`order-${orderId}`).emit('new-message', {
      id: Date.now().toString(),
      orderId,
      senderId,
      senderType,
      message,
      timestamp: new Date().toISOString(),
      isRead: false
    });
  });

  // Order status updates
  socket.on('order-status-update', (data) => {
    const { orderId, status, restaurantId } = data;
    
    // Broadcast status update to customer
    io.to(`order-${orderId}`).emit('order-status-changed', {
      orderId,
      status,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io };
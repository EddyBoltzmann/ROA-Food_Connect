const mongoose = require('mongoose');

const selectedCustomizationSchema = new mongoose.Schema({
  customizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  optionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }]
});

const cartItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  customizations: [selectedCustomizationSchema],
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price cannot be negative']
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required'],
    min: [0, 'Delivery fee cannot be negative']
  },
  tax: {
    type: Number,
    required: [true, 'Tax is required'],
    min: [0, 'Tax cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total cannot be negative']
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'mobile_money', 'cash_on_delivery'],
      required: [true, 'Payment method type is required']
    },
    last4: String,
    brand: String,
    transactionId: String
  },
  deliveryAddress: {
    label: {
      type: String,
      required: true,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'USA'
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  },
  estimatedDeliveryTime: {
    type: String,
    required: [true, 'Estimated delivery time is required']
  },
  actualDeliveryTime: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0,
    min: [0, 'Loyalty points earned cannot be negative']
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0,
    min: [0, 'Loyalty points used cannot be negative']
  },
  promoCode: {
    type: String,
    trim: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, status: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ trackingNumber: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate tracking number
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.trackingNumber) {
    this.trackingNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

// Virtual for order duration
orderSchema.virtual('duration').get(function() {
  if (this.actualDeliveryTime) {
    return Math.round((this.actualDeliveryTime - this.createdAt) / (1000 * 60)); // minutes
  }
  return null;
});

// Virtual for formatted total
orderSchema.virtual('formattedTotal').get(function() {
  return `$${this.total.toFixed(2)}`;
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'delivered') {
    this.actualDeliveryTime = new Date();
  }
  return this.save();
};

// Method to calculate loyalty points earned
orderSchema.methods.calculateLoyaltyPoints = function() {
  // Earn 1 point for every $1 spent
  return Math.floor(this.total);
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status) {
  return this.find({ status, isActive: true })
    .populate('userId', 'name email phone')
    .populate('restaurantId', 'name address')
    .populate('items.menuItem', 'name price')
    .sort({ createdAt: -1 });
};

// Static method to get user's order history
orderSchema.statics.getUserOrders = function(userId, limit = 10, skip = 0) {
  return this.find({ userId, isActive: true })
    .populate('restaurantId', 'name image')
    .populate('items.menuItem', 'name price image')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get restaurant's orders
orderSchema.statics.getRestaurantOrders = function(restaurantId, status = null, limit = 50, skip = 0) {
  const query = { restaurantId, isActive: true };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('userId', 'name email phone')
    .populate('items.menuItem', 'name price')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

module.exports = mongoose.model('Order', orderSchema);
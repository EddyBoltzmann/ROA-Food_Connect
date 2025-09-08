const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
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
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const paymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['card', 'mobile_money', 'cash_on_delivery'],
    required: true
  },
  last4: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userPreferencesSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ['en', 'tw', 'fr'],
    default: 'en'
  },
  darkMode: {
    type: Boolean,
    default: false
  },
  notifications: {
    orderUpdates: {
      type: Boolean,
      default: true
    },
    promotions: {
      type: Boolean,
      default: true
    },
    loyalty: {
      type: Boolean,
      default: true
    }
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant_owner', 'chef', 'admin'],
    default: 'customer'
  },
  // Restaurant owner specific fields
  restaurantName: {
    type: String,
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  restaurantAddress: {
    type: String,
    trim: true,
    maxlength: [200, 'Restaurant address cannot exceed 200 characters']
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: [0, 'Loyalty points cannot be negative']
  },
  addresses: [addressSchema],
  paymentMethods: [paymentMethodSchema],
  preferences: {
    type: userPreferencesSchema,
    default: () => ({})
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get default address
userSchema.methods.getDefaultAddress = function() {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
};

// Get default payment method
userSchema.methods.getDefaultPaymentMethod = function() {
  return this.paymentMethods.find(pm => pm.isDefault) || this.paymentMethods[0];
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

module.exports = mongoose.model('User', userSchema);
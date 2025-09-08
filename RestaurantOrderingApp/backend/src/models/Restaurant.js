const mongoose = require('mongoose');

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
    default: true
  }
});

const openingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  open: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  close: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  isClosed: {
    type: Boolean,
    default: false
  }
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Restaurant description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  cuisine: [{
    type: String,
    required: true,
    trim: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  deliveryTime: {
    type: String,
    required: [true, 'Delivery time is required'],
    trim: true
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required'],
    min: [0, 'Delivery fee cannot be negative']
  },
  minimumOrder: {
    type: Number,
    required: [true, 'Minimum order amount is required'],
    min: [0, 'Minimum order cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Restaurant image is required']
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  address: {
    type: addressSchema,
    required: [true, 'Restaurant address is required']
  },
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openingHours: [openingHoursSchema],
  features: [{
    type: String,
    enum: ['Delivery', 'Takeout', 'Dine-in', 'Drive-through', 'Catering'],
    required: true
  }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  menu: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  qrCode: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
restaurantSchema.index({ name: 'text', description: 'text', cuisine: 'text' });
restaurantSchema.index({ coordinates: '2dsphere' });
restaurantSchema.index({ ownerId: 1 });
restaurantSchema.index({ isActive: 1, isOpen: 1 });
restaurantSchema.index({ rating: -1 });
restaurantSchema.index({ deliveryFee: 1 });

// Virtual for average rating
restaurantSchema.virtual('averageRating').get(function() {
  return this.rating;
});

// Method to check if restaurant is currently open
restaurantSchema.methods.isCurrentlyOpen = function() {
  if (!this.isOpen) return false;
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayHours = this.openingHours.find(hours => hours.day === currentDay);
  
  if (!todayHours || todayHours.isClosed) return false;
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

// Method to calculate distance from user location
restaurantSchema.methods.calculateDistance = function(userLat, userLng) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (this.coordinates.latitude - userLat) * Math.PI / 180;
  const dLng = (this.coordinates.longitude - userLng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(userLat * Math.PI / 180) * Math.cos(this.coordinates.latitude * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

module.exports = mongoose.model('Restaurant', restaurantSchema);
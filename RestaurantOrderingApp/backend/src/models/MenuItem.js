const mongoose = require('mongoose');

const customizationOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Option name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Option price is required'],
    min: [0, 'Price cannot be negative']
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const customizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customization name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['single', 'multiple'],
    required: [true, 'Customization type is required']
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [customizationOptionSchema]
});

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  dietaryTags: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher', 'Spicy', 'Low-Carb', 'Keto'],
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  customizations: [customizationSchema],
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 15, // minutes
    min: [1, 'Preparation time must be at least 1 minute']
  },
  calories: {
    type: Number,
    min: [0, 'Calories cannot be negative']
  },
  allergens: [{
    type: String,
    enum: ['Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish', 'Sesame'],
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ restaurantId: 1, isAvailable: 1, isActive: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ dietaryTags: 1 });
menuItemSchema.index({ price: 1 });

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Method to get available customizations
menuItemSchema.methods.getAvailableCustomizations = function() {
  return this.customizations.filter(customization => 
    customization.options && customization.options.length > 0
  );
};

// Method to calculate total price with customizations
menuItemSchema.methods.calculateTotalPrice = function(selectedCustomizations = []) {
  let totalPrice = this.price;
  
  selectedCustomizations.forEach(customization => {
    const customizationData = this.customizations.find(c => c._id.toString() === customization.customizationId);
    if (customizationData) {
      customization.optionIds.forEach(optionId => {
        const option = customizationData.options.find(o => o._id.toString() === optionId);
        if (option) {
          totalPrice += option.price;
        }
      });
    }
  });
  
  return totalPrice;
};

// Static method to get menu items by category
menuItemSchema.statics.getByCategory = function(restaurantId, category) {
  return this.find({
    restaurantId,
    category,
    isAvailable: true,
    isActive: true
  }).sort({ order: 1, name: 1 });
};

// Static method to get categories for a restaurant
menuItemSchema.statics.getCategories = function(restaurantId) {
  return this.distinct('category', {
    restaurantId,
    isAvailable: true,
    isActive: true
  });
};

module.exports = mongoose.model('MenuItem', menuItemSchema);
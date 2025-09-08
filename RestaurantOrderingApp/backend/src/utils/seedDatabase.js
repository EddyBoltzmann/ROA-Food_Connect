const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// Sample data
const sampleUsers = [
  {
    email: 'admin@foodiehub.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '+1234567890',
    role: 'admin',
    loyaltyPoints: 0,
    addresses: [],
    paymentMethods: [],
    preferences: {
      language: 'en',
      darkMode: false,
      notifications: {
        orderUpdates: true,
        promotions: true,
        loyalty: true,
      },
    },
  },
  {
    email: 'owner@bellavista.com',
    password: 'owner123',
    name: 'Bella Vista Owner',
    phone: '+1234567891',
    role: 'restaurant_owner',
    loyaltyPoints: 0,
    addresses: [],
    paymentMethods: [],
    preferences: {
      language: 'en',
      darkMode: false,
      notifications: {
        orderUpdates: true,
        promotions: true,
        loyalty: true,
      },
    },
  },
  {
    email: 'customer@example.com',
    password: 'customer123',
    name: 'John Doe',
    phone: '+1234567892',
    role: 'customer',
    loyaltyPoints: 150,
    addresses: [
      {
        label: 'Home',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
        isDefault: true,
      },
    ],
    paymentMethods: [
      {
        type: 'card',
        last4: '4242',
        brand: 'visa',
        isDefault: true,
      },
    ],
    preferences: {
      language: 'en',
      darkMode: false,
      notifications: {
        orderUpdates: true,
        promotions: true,
        loyalty: true,
      },
    },
  },
];

const sampleRestaurants = [
  {
    name: 'Bella Vista Restaurant',
    description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations.',
    cuisine: ['Italian', 'Pizza', 'Pasta', 'Mediterranean'],
    rating: 4.5,
    reviewCount: 128,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    minimumOrder: 15.00,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    address: {
      label: 'Main Location',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060,
      },
      isDefault: true,
    },
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
    isOpen: true,
    openingHours: [
      { day: 'Monday', open: '09:00', close: '22:00', isClosed: false },
      { day: 'Tuesday', open: '09:00', close: '22:00', isClosed: false },
      { day: 'Wednesday', open: '09:00', close: '22:00', isClosed: false },
      { day: 'Thursday', open: '09:00', close: '22:00', isClosed: false },
      { day: 'Friday', open: '09:00', close: '23:00', isClosed: false },
      { day: 'Saturday', open: '10:00', close: '23:00', isClosed: false },
      { day: 'Sunday', open: '10:00', close: '21:00', isClosed: false },
    ],
    features: ['Delivery', 'Takeout', 'Dine-in'],
    menu: [],
  },
  {
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine with aromatic spices and traditional cooking methods.',
    cuisine: ['Indian', 'Curry', 'Vegetarian', 'Spicy'],
    rating: 4.3,
    reviewCount: 89,
    deliveryTime: '30-40 min',
    deliveryFee: 3.99,
    minimumOrder: 20.00,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    coverImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    address: {
      label: 'Main Location',
      street: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA',
      coordinates: {
        latitude: 40.7589,
        longitude: -73.9851,
      },
      isDefault: true,
    },
    coordinates: {
      latitude: 40.7589,
      longitude: -73.9851,
    },
    isOpen: true,
    openingHours: [
      { day: 'Monday', open: '11:00', close: '23:00', isClosed: false },
      { day: 'Tuesday', open: '11:00', close: '23:00', isClosed: false },
      { day: 'Wednesday', open: '11:00', close: '23:00', isClosed: false },
      { day: 'Thursday', open: '11:00', close: '23:00', isClosed: false },
      { day: 'Friday', open: '11:00', close: '24:00', isClosed: false },
      { day: 'Saturday', open: '11:00', close: '24:00', isClosed: false },
      { day: 'Sunday', open: '12:00', close: '22:00', isClosed: false },
    ],
    features: ['Delivery', 'Takeout', 'Dine-in'],
    menu: [],
  },
];

const sampleMenuItems = [
  // Bella Vista Restaurant Menu Items
  {
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, and basil on our signature thin crust',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    category: 'Pizza',
    dietaryTags: ['Vegetarian'],
    isAvailable: true,
    customizations: [
      {
        name: 'Size',
        type: 'single',
        required: true,
        options: [
          { name: 'Small (10")', price: 0, isDefault: true },
          { name: 'Medium (12")', price: 3.00, isDefault: false },
          { name: 'Large (14")', price: 6.00, isDefault: false },
        ],
      },
      {
        name: 'Extra Toppings',
        type: 'multiple',
        required: false,
        options: [
          { name: 'Extra Cheese', price: 2.00, isDefault: false },
          { name: 'Mushrooms', price: 1.50, isDefault: false },
          { name: 'Olives', price: 1.50, isDefault: false },
        ],
      },
    ],
    preparationTime: 15,
    calories: 280,
    allergens: ['Dairy', 'Wheat'],
  },
  {
    name: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta with eggs, cheese, and pancetta',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
    category: 'Pasta',
    dietaryTags: [],
    isAvailable: true,
    customizations: [
      {
        name: 'Pasta Type',
        type: 'single',
        required: true,
        options: [
          { name: 'Spaghetti', price: 0, isDefault: true },
          { name: 'Fettuccine', price: 0, isDefault: false },
          { name: 'Penne', price: 0, isDefault: false },
        ],
      },
    ],
    preparationTime: 20,
    calories: 450,
    allergens: ['Eggs', 'Dairy', 'Wheat'],
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese and croutons',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    category: 'Salads',
    dietaryTags: ['Vegetarian'],
    isAvailable: true,
    customizations: [
      {
        name: 'Dressing',
        type: 'single',
        required: true,
        options: [
          { name: 'Caesar Dressing', price: 0, isDefault: true },
          { name: 'Ranch Dressing', price: 0, isDefault: false },
          { name: 'Balsamic Vinaigrette', price: 0, isDefault: false },
        ],
      },
    ],
    preparationTime: 10,
    calories: 180,
    allergens: ['Dairy', 'Eggs', 'Wheat'],
  },
  // Spice Garden Menu Items
  {
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken in creamy tomato sauce with aromatic spices',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400',
    category: 'Curry',
    dietaryTags: ['Spicy'],
    isAvailable: true,
    customizations: [
      {
        name: 'Spice Level',
        type: 'single',
        required: true,
        options: [
          { name: 'Mild', price: 0, isDefault: true },
          { name: 'Medium', price: 0, isDefault: false },
          { name: 'Hot', price: 0, isDefault: false },
        ],
      },
      {
        name: 'Rice Type',
        type: 'single',
        required: true,
        options: [
          { name: 'Basmati Rice', price: 0, isDefault: true },
          { name: 'Jasmine Rice', price: 1.00, isDefault: false },
        ],
      },
    ],
    preparationTime: 25,
    calories: 380,
    allergens: ['Dairy'],
  },
  {
    name: 'Vegetable Biryani',
    description: 'Fragrant basmati rice with mixed vegetables and aromatic spices',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    category: 'Rice',
    dietaryTags: ['Vegetarian', 'Vegan'],
    isAvailable: true,
    customizations: [
      {
        name: 'Spice Level',
        type: 'single',
        required: true,
        options: [
          { name: 'Mild', price: 0, isDefault: true },
          { name: 'Medium', price: 0, isDefault: false },
          { name: 'Hot', price: 0, isDefault: false },
        ],
      },
    ],
    preparationTime: 30,
    calories: 320,
    allergens: [],
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`👤 Created user: ${user.name} (${user.email})`);
    }

    // Create restaurants
    const restaurants = [];
    for (let i = 0; i < sampleRestaurants.length; i++) {
      const restaurantData = {
        ...sampleRestaurants[i],
        ownerId: users[1]._id, // Assign to restaurant owner
      };
      const restaurant = new Restaurant(restaurantData);
      await restaurant.save();
      restaurants.push(restaurant);
      console.log(`🏪 Created restaurant: ${restaurant.name}`);
    }

    // Create menu items
    const menuItems = [];
    for (let i = 0; i < sampleMenuItems.length; i++) {
      const menuItemData = {
        ...sampleMenuItems[i],
        restaurantId: restaurants[Math.floor(i / 3)]._id, // Distribute items across restaurants
      };
      const menuItem = new MenuItem(menuItemData);
      await menuItem.save();
      menuItems.push(menuItem);
      console.log(`🍽️ Created menu item: ${menuItem.name}`);
    }

    // Update restaurants with menu items
    for (let i = 0; i < restaurants.length; i++) {
      const restaurantMenuItems = menuItems.filter(
        item => item.restaurantId.toString() === restaurants[i]._id.toString()
      );
      restaurants[i].menu = restaurantMenuItems.map(item => item._id);
      await restaurants[i].save();
      console.log(`📋 Updated restaurant menu: ${restaurants[i].name} (${restaurantMenuItems.length} items)`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${restaurants.length} restaurants`);
    console.log(`   - ${menuItems.length} menu items`);

    // Display sample login credentials
    console.log('\n🔑 Sample Login Credentials:');
    console.log('Admin: admin@foodiehub.com / admin123');
    console.log('Restaurant Owner: owner@bellavista.com / owner123');
    console.log('Customer: customer@example.com / customer123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
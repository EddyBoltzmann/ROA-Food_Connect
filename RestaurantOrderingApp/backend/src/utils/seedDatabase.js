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
    email: 'admin@foodconnect.com',
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
    email: 'owner@auntieama.com',
    password: 'owner123',
    name: 'Auntie Ama',
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
    name: 'Auntie Ama\'s Kitchen',
    description: 'Authentic Ghanaian cuisine with traditional recipes passed down through generations. Experience the rich flavors of Ghana with our signature waakye, banku, and fufu dishes.',
    cuisine: ['Ghanaian', 'Traditional', 'Waakye', 'Banku', 'Fufu'],
    rating: 4.7,
    reviewCount: 156,
    deliveryTime: '20-30 min',
    deliveryFee: 2.50,
    minimumOrder: 25.00,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    address: {
      label: 'Main Location',
      street: '123 Oxford Street',
      city: 'Accra',
      region: 'Greater Accra',
      zipCode: 'GA-123-4567',
      country: 'Ghana',
      coordinates: {
        latitude: 5.6037,
        longitude: -0.1870,
      },
      isDefault: true,
    },
    coordinates: {
      latitude: 5.6037,
      longitude: -0.1870,
    },
    isOpen: true,
    openingHours: [
      { day: 'Monday', open: '06:00', close: '22:00', isClosed: false },
      { day: 'Tuesday', open: '06:00', close: '22:00', isClosed: false },
      { day: 'Wednesday', open: '06:00', close: '22:00', isClosed: false },
      { day: 'Thursday', open: '06:00', close: '22:00', isClosed: false },
      { day: 'Friday', open: '06:00', close: '23:00', isClosed: false },
      { day: 'Saturday', open: '07:00', close: '23:00', isClosed: false },
      { day: 'Sunday', open: '08:00', close: '21:00', isClosed: false },
    ],
    features: ['Delivery', 'Takeout', 'Dine-in', 'Traditional'],
    menu: [],
  },
  {
    name: 'Kofi\'s Chop Bar',
    description: 'Experience the authentic taste of Ghana with our traditional chop bar. Specializing in banku, fufu, and fresh palm wine. A true taste of home.',
    cuisine: ['Ghanaian', 'Chop Bar', 'Banku', 'Fufu', 'Palm Wine'],
    rating: 4.5,
    reviewCount: 98,
    deliveryTime: '25-35 min',
    deliveryFee: 3.00,
    minimumOrder: 20.00,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
    coverImage: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800',
    address: {
      label: 'Main Location',
      street: '456 Ring Road',
      city: 'Kumasi',
      region: 'Ashanti',
      zipCode: 'AS-789-0123',
      country: 'Ghana',
      coordinates: {
        latitude: 6.6885,
        longitude: -1.6244,
      },
      isDefault: true,
    },
    coordinates: {
      latitude: 6.6885,
      longitude: -1.6244,
    },
    isOpen: true,
    openingHours: [
      { day: 'Monday', open: '05:00', close: '21:00', isClosed: false },
      { day: 'Tuesday', open: '05:00', close: '21:00', isClosed: false },
      { day: 'Wednesday', open: '05:00', close: '21:00', isClosed: false },
      { day: 'Thursday', open: '05:00', close: '21:00', isClosed: false },
      { day: 'Friday', open: '05:00', close: '22:00', isClosed: false },
      { day: 'Saturday', open: '06:00', close: '22:00', isClosed: false },
      { day: 'Sunday', open: '07:00', close: '20:00', isClosed: false },
    ],
    features: ['Delivery', 'Takeout', 'Dine-in', 'Traditional', 'Palm Wine'],
    menu: [],
  },
  {
    name: 'Mama Grace\'s Waakye Spot',
    description: 'The best waakye in Accra! Our signature waakye is made with love and served with all the traditional accompaniments. A must-try for waakye lovers.',
    cuisine: ['Ghanaian', 'Waakye', 'Traditional', 'Street Food'],
    rating: 4.8,
    reviewCount: 203,
    deliveryTime: '15-25 min',
    deliveryFee: 2.00,
    minimumOrder: 15.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
    address: {
      label: 'Main Location',
      street: '789 Labadi Road',
      city: 'Accra',
      region: 'Greater Accra',
      zipCode: 'GA-456-7890',
      country: 'Ghana',
      coordinates: {
        latitude: 5.5500,
        longitude: -0.2000,
      },
      isDefault: true,
    },
    coordinates: {
      latitude: 5.5500,
      longitude: -0.2000,
    },
    isOpen: true,
    openingHours: [
      { day: 'Monday', open: '05:30', close: '14:00', isClosed: false },
      { day: 'Tuesday', open: '05:30', close: '14:00', isClosed: false },
      { day: 'Wednesday', open: '05:30', close: '14:00', isClosed: false },
      { day: 'Thursday', open: '05:30', close: '14:00', isClosed: false },
      { day: 'Friday', open: '05:30', close: '14:00', isClosed: false },
      { day: 'Saturday', open: '06:00', close: '15:00', isClosed: false },
      { day: 'Sunday', open: '07:00', close: '14:00', isClosed: false },
    ],
    features: ['Delivery', 'Takeout', 'Traditional', 'Street Food'],
    menu: [],
  },
];

const sampleMenuItems = [
  // Auntie Ama's Kitchen Menu Items
  {
    name: 'Waakye with Goat Meat',
    description: 'Traditional Ghanaian waakye (rice and beans) served with tender goat meat, gari, shito, and boiled eggs',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    category: 'Traditional',
    dietaryTags: ['Traditional', 'Protein'],
    isAvailable: true,
    customizations: [
      {
        name: 'Meat Choice',
        type: 'single',
        required: true,
        options: [
          { name: 'Goat Meat', price: 0, isDefault: true },
          { name: 'Beef', price: 2.00, isDefault: false },
          { name: 'Chicken', price: 1.50, isDefault: false },
          { name: 'Fish', price: 3.00, isDefault: false },
        ],
      },
      {
        name: 'Extras',
        type: 'multiple',
        required: false,
        options: [
          { name: 'Extra Gari', price: 1.00, isDefault: false },
          { name: 'Extra Shito', price: 1.50, isDefault: false },
          { name: 'Boiled Egg', price: 2.00, isDefault: false },
          { name: 'Fried Plantain', price: 3.00, isDefault: false },
        ],
      },
    ],
    preparationTime: 25,
    calories: 520,
    allergens: ['Gluten'],
  },
  {
    name: 'Banku with Tilapia',
    description: 'Traditional banku (fermented corn and cassava dough) served with grilled tilapia and pepper sauce',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
    category: 'Traditional',
    dietaryTags: ['Traditional', 'Seafood'],
    isAvailable: true,
    customizations: [
      {
        name: 'Fish Size',
        type: 'single',
        required: true,
        options: [
          { name: 'Small Tilapia', price: 0, isDefault: true },
          { name: 'Medium Tilapia', price: 5.00, isDefault: false },
          { name: 'Large Tilapia', price: 8.00, isDefault: false },
        ],
      },
      {
        name: 'Sauce',
        type: 'single',
        required: true,
        options: [
          { name: 'Mild Pepper Sauce', price: 0, isDefault: true },
          { name: 'Hot Pepper Sauce', price: 0, isDefault: false },
          { name: 'Extra Hot Sauce', price: 1.00, isDefault: false },
        ],
      },
    ],
    preparationTime: 30,
    calories: 480,
    allergens: ['Fish'],
  },
  {
    name: 'Fufu with Light Soup',
    description: 'Traditional fufu (pounded cassava and plantain) served with light soup and your choice of meat',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    category: 'Traditional',
    dietaryTags: ['Traditional', 'Soup'],
    isAvailable: true,
    customizations: [
      {
        name: 'Soup Type',
        type: 'single',
        required: true,
        options: [
          { name: 'Light Soup', price: 0, isDefault: true },
          { name: 'Palm Nut Soup', price: 2.00, isDefault: false },
          { name: 'Groundnut Soup', price: 2.00, isDefault: false },
        ],
      },
      {
        name: 'Meat Choice',
        type: 'single',
        required: true,
        options: [
          { name: 'Goat Meat', price: 0, isDefault: true },
          { name: 'Beef', price: 2.00, isDefault: false },
          { name: 'Chicken', price: 1.50, isDefault: false },
          { name: 'Fish', price: 3.00, isDefault: false },
        ],
      },
    ],
    preparationTime: 35,
    calories: 450,
    allergens: [],
  },
  // Kofi's Chop Bar Menu Items
  {
    name: 'Jollof Rice with Chicken',
    description: 'Aromatic Ghanaian jollof rice cooked with tomatoes, onions, and spices, served with grilled chicken',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    category: 'Rice',
    dietaryTags: ['Traditional', 'Spicy'],
    isAvailable: true,
    customizations: [
      {
        name: 'Chicken Style',
        type: 'single',
        required: true,
        options: [
          { name: 'Grilled Chicken', price: 0, isDefault: true },
          { name: 'Fried Chicken', price: 1.00, isDefault: false },
          { name: 'Chicken Wings', price: 2.00, isDefault: false },
        ],
      },
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
    preparationTime: 20,
    calories: 420,
    allergens: [],
  },
  {
    name: 'Red Red (Beans and Plantain)',
    description: 'Traditional Ghanaian red red - black-eyed peas in palm oil sauce served with fried ripe plantain',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
    category: 'Traditional',
    dietaryTags: ['Vegetarian', 'Traditional'],
    isAvailable: true,
    customizations: [
      {
        name: 'Plantain Style',
        type: 'single',
        required: true,
        options: [
          { name: 'Fried Ripe Plantain', price: 0, isDefault: true },
          { name: 'Boiled Plantain', price: 0, isDefault: false },
          { name: 'Extra Plantain', price: 3.00, isDefault: false },
        ],
      },
      {
        name: 'Extras',
        type: 'multiple',
        required: false,
        options: [
          { name: 'Extra Palm Oil', price: 1.00, isDefault: false },
          { name: 'Gari', price: 1.50, isDefault: false },
          { name: 'Fried Fish', price: 5.00, isDefault: false },
        ],
      },
    ],
    preparationTime: 15,
    calories: 380,
    allergens: [],
  },
  // Mama Grace's Waakye Spot Menu Items
  {
    name: 'Waakye Special',
    description: 'Our signature waakye with all the works - rice, beans, gari, shito, boiled eggs, and your choice of protein',
    price: 30.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    category: 'Waakye',
    dietaryTags: ['Traditional', 'Signature'],
    isAvailable: true,
    customizations: [
      {
        name: 'Protein Choice',
        type: 'single',
        required: true,
        options: [
          { name: 'Goat Meat', price: 0, isDefault: true },
          { name: 'Beef', price: 2.00, isDefault: false },
          { name: 'Chicken', price: 1.50, isDefault: false },
          { name: 'Fish', price: 3.00, isDefault: false },
          { name: 'Vegetarian', price: -2.00, isDefault: false },
        ],
      },
      {
        name: 'Waakye Size',
        type: 'single',
        required: true,
        options: [
          { name: 'Regular', price: 0, isDefault: true },
          { name: 'Large', price: 5.00, isDefault: false },
          { name: 'Extra Large', price: 8.00, isDefault: false },
        ],
      },
    ],
    preparationTime: 20,
    calories: 500,
    allergens: ['Gluten'],
  },
  {
    name: 'Kelewele',
    description: 'Spiced fried plantain cubes - a perfect side dish or snack with our signature spice blend',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    category: 'Sides',
    dietaryTags: ['Vegetarian', 'Traditional'],
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
        name: 'Size',
        type: 'single',
        required: true,
        options: [
          { name: 'Small', price: 0, isDefault: true },
          { name: 'Medium', price: 3.00, isDefault: false },
          { name: 'Large', price: 5.00, isDefault: false },
        ],
      },
    ],
    preparationTime: 10,
    calories: 180,
    allergens: [],
  },
  {
    name: 'Fresh Palm Wine',
    description: 'Traditional Ghanaian palm wine - naturally fermented and served fresh from the palm tree',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
    category: 'Beverages',
    dietaryTags: ['Traditional', 'Alcoholic'],
    isAvailable: true,
    customizations: [
      {
        name: 'Size',
        type: 'single',
        required: true,
        options: [
          { name: 'Small (250ml)', price: 0, isDefault: true },
          { name: 'Medium (500ml)', price: 5.00, isDefault: false },
          { name: 'Large (1L)', price: 8.00, isDefault: false },
        ],
      },
      {
        name: 'Temperature',
        type: 'single',
        required: true,
        options: [
          { name: 'Fresh (Cold)', price: 0, isDefault: true },
          { name: 'Room Temperature', price: 0, isDefault: false },
        ],
      },
    ],
    preparationTime: 5,
    calories: 120,
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
    console.log('Admin: admin@foodconnect.com / admin123');
    console.log('Restaurant Owner: owner@auntieama.com / owner123');
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
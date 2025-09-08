# MongoDB Atlas Setup Guide

## 🌐 Overview

This guide will help you set up MongoDB Atlas (Cloud MongoDB) for the Restaurant Ordering App backend. MongoDB Atlas is a fully managed cloud database service that provides high availability, automatic scaling, and global distribution.

## 🚀 Step-by-Step Setup

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Start Free"
3. Sign up with your email or use Google/GitHub
4. Verify your email address

### 2. Create a New Cluster

1. **Choose a Cloud Provider and Region**
   - Select AWS, Google Cloud, or Azure
   - Choose a region closest to your users
   - For development: Any region is fine
   - For production: Choose based on your user base

2. **Select Cluster Tier**
   - **Free Tier (M0)**: Perfect for development and testing
   - **Shared Clusters (M2/M5)**: For small production apps
   - **Dedicated Clusters**: For large-scale production

3. **Configure Cluster**
   - Cluster Name: `restaurant-ordering-cluster`
   - MongoDB Version: Latest stable version
   - Click "Create Cluster"

### 3. Set Up Database Access

1. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `restaurant-app-user`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

2. **Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses
   - Click "Confirm"

### 4. Get Connection String

1. **Connect to Cluster**
   - Go to "Clusters" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js
   - Version: 4.1 or later

2. **Copy Connection String**
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/restaurant-ordering?retryWrites=true&w=majority
   ```

3. **Replace Placeholders**
   - `<username>`: Your database username
   - `<password>`: Your database password
   - `<cluster-url>`: Your cluster URL (provided by Atlas)

## 🔧 Backend Configuration

### 1. Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://restaurant-app-user:your-password@restaurant-ordering-cluster.xxxxx.mongodb.net/restaurant-ordering?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRE=30d

# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### 2. Test Connection

Start your backend server:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB Atlas
📊 Database: restaurant-ordering
🌐 Host: restaurant-ordering-cluster-shard-00-00.xxxxx.mongodb.net
🔗 Mongoose connected to MongoDB Atlas
```

## 📊 Database Collections

The app will automatically create these collections:

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  phone: String,
  role: String, // 'customer', 'restaurant_owner', 'chef', 'admin'
  loyaltyPoints: Number,
  addresses: Array,
  paymentMethods: Array,
  preferences: Object,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Restaurants Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  cuisine: Array,
  rating: Number,
  reviewCount: Number,
  deliveryTime: String,
  deliveryFee: Number,
  minimumOrder: Number,
  image: String,
  coverImage: String,
  address: Object,
  coordinates: Object,
  isOpen: Boolean,
  openingHours: Array,
  features: Array,
  ownerId: ObjectId,
  menu: Array,
  isActive: Boolean,
  qrCode: String,
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItems Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  dietaryTags: Array,
  isAvailable: Boolean,
  customizations: Array,
  restaurantId: ObjectId,
  order: Number,
  isActive: Boolean,
  preparationTime: Number,
  calories: Number,
  allergens: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  restaurantId: ObjectId,
  items: Array,
  subtotal: Number,
  deliveryFee: Number,
  tax: Number,
  discount: Number,
  total: Number,
  status: String,
  paymentMethod: Object,
  deliveryAddress: Object,
  estimatedDeliveryTime: String,
  actualDeliveryTime: Date,
  notes: String,
  loyaltyPointsEarned: Number,
  loyaltyPointsUsed: Number,
  promoCode: String,
  driverId: ObjectId,
  trackingNumber: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Best Practices

### 1. Database User Security
- Use strong, unique passwords
- Create separate users for different environments
- Regularly rotate passwords
- Use least privilege principle

### 2. Network Security
- **Development**: Allow access from anywhere (0.0.0.0/0)
- **Production**: Whitelist specific IP addresses only
- Use VPC peering for AWS/Azure/GCP deployments

### 3. Connection String Security
- Never commit connection strings to version control
- Use environment variables
- Rotate connection strings regularly
- Use MongoDB Atlas connection string parameters

### 4. Data Encryption
- Enable encryption at rest (default in Atlas)
- Use TLS/SSL for connections (default in Atlas)
- Encrypt sensitive data in application layer

## 📈 Monitoring and Maintenance

### 1. Atlas Monitoring
- Monitor cluster performance in Atlas dashboard
- Set up alerts for high CPU/memory usage
- Monitor connection count and query performance
- Review slow query logs

### 2. Backup Strategy
- **Free Tier**: Daily backups (7-day retention)
- **Paid Tiers**: Continuous backups with point-in-time recovery
- Test backup restoration regularly

### 3. Scaling
- **Vertical Scaling**: Upgrade cluster tier
- **Horizontal Scaling**: Add shards for large datasets
- **Read Scaling**: Add read replicas for read-heavy workloads

## 🚀 Production Deployment

### 1. Environment-Specific Clusters
- **Development**: M0 (Free tier)
- **Staging**: M2/M5 (Shared cluster)
- **Production**: M10+ (Dedicated cluster)

### 2. Connection String for Production
```env
MONGODB_URI=mongodb+srv://prod-user:secure-password@prod-cluster.xxxxx.mongodb.net/restaurant-ordering-prod?retryWrites=true&w=majority&authSource=admin
```

### 3. Performance Optimization
- Create appropriate indexes
- Use connection pooling
- Implement query optimization
- Monitor and tune performance

## 🔧 Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check network access settings
   - Verify connection string
   - Check firewall settings

2. **Authentication Failed**
   - Verify username/password
   - Check database user permissions
   - Ensure user exists in correct database

3. **SSL/TLS Issues**
   - Ensure connection string uses `mongodb+srv://`
   - Check certificate validity
   - Verify TLS version compatibility

### Debug Mode
Enable debug logging in your app:

```javascript
// In server.js
mongoose.set('debug', true);
```

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/core/best-practices/)
- [Atlas Security Checklist](https://docs.atlas.mongodb.com/security-checklist/)

## 🎯 Next Steps

1. ✅ Set up MongoDB Atlas account
2. ✅ Create cluster and database user
3. ✅ Configure network access
4. ✅ Update backend environment variables
5. ✅ Test connection
6. ✅ Deploy to production with proper security

Your Restaurant Ordering App is now ready to use MongoDB Atlas as the cloud database! 🎉
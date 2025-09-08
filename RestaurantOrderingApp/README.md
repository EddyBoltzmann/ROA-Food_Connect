# Restaurant Ordering App

A comprehensive cross-platform mobile application for restaurant ordering, built with React Native and Node.js. Features include restaurant discovery, menu browsing, order management, real-time chat, loyalty system, and QR code-based dine-in access.

## 🚀 Features

### Customer Features
- **Restaurant Discovery**: Browse nearby restaurants with search and filtering
- **Menu Browsing**: View detailed menus with images, descriptions, and dietary tags
- **Order Management**: Add items to cart, customize orders, and track delivery
- **Real-time Chat**: Communicate with restaurant staff during order preparation
- **Loyalty System**: Earn and redeem points for discounts
- **QR Code Scanning**: Scan QR codes on tables for quick menu access
- **Multiple Payment Methods**: Support for cards, mobile money, and cash on delivery
- **Order Tracking**: Real-time order status updates
- **Dark Mode**: Beautiful dark theme support
- **Multi-language**: English, Twi, and French support

### Restaurant Owner Features
- **Menu Management**: Full CRUD operations for menu items
- **Order Management**: View and update order statuses
- **QR Code Generation**: Generate QR codes for tables and restaurant
- **Analytics Dashboard**: View order statistics and popular items
- **Real-time Notifications**: Get notified of new orders and customer messages

## 🛠 Technology Stack

### Frontend
- **React Native** with TypeScript
- **React Navigation** for navigation
- **Redux Toolkit** for state management
- **React Native Reanimated** for animations
- **Styled Components** for styling
- **Socket.IO Client** for real-time communication
- **React Native QR Code Scanner** for QR functionality

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Redis** for caching
- **Cloudinary** for image storage
- **Stripe** for payments
- **QRCode** for QR generation

## 📱 Screenshots

*Screenshots will be added once the app is built and running*

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- React Native development environment
- MongoDB Atlas account (recommended) or local MongoDB
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RestaurantOrderingApp
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up MongoDB Atlas (Recommended)**
   ```bash
   # Create a MongoDB Atlas account at https://www.mongodb.com/atlas
   # Create a free cluster (M0 tier)
   # Create a database user with read/write permissions
   # Add your IP address to network access
   # Get your connection string
   ```

5. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/.env.example backend/.env
   
   # Edit the .env file with your MongoDB Atlas connection string
   nano backend/.env
   ```

6. **Seed the database with sample data**
   ```bash
   cd backend
   npm run seed
   ```

7. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

8. **Start the React Native app**
   ```bash
   # For iOS
   npx react-native run-ios
   
   # For Android
   npx react-native run-android
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database - MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/restaurant-ordering?retryWrites=true&w=majority

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

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # App screens
├── navigation/         # Navigation configuration
├── store/             # Redux store and slices
├── services/          # API services
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── assets/            # Images, icons, animations
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/restaurants` - Create restaurant (Owner)
- `PUT /api/restaurants/:id` - Update restaurant (Owner)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Owner)

### Chat
- `GET /api/chat/:orderId/messages` - Get chat messages
- `POST /api/chat/:orderId/messages` - Send message

### Loyalty
- `GET /api/loyalty/points` - Get user's loyalty points
- `GET /api/loyalty/rewards` - Get available rewards
- `POST /api/loyalty/redeem` - Redeem reward

### QR Codes
- `GET /api/qr/restaurant/:id` - Generate restaurant QR code
- `POST /api/qr/scan` - Process QR code scan

### Health Checks
- `GET /api/health` - Basic health check
- `GET /api/health/database` - Database health check with detailed stats

## 🗄️ Database Management

### Seeding the Database
```bash
# Seed with sample data
cd backend
npm run seed

# Seed for development environment
npm run seed:dev

# Seed for production environment
npm run seed:prod
```

### Database Health Monitoring
```bash
# Check database health
curl http://localhost:5000/api/health/database

# Basic health check
curl http://localhost:5000/api/health
```

### Sample Login Credentials
After seeding the database, you can use these credentials:
- **Admin**: `admin@foodiehub.com` / `admin123`
- **Restaurant Owner**: `owner@bellavista.com` / `owner123`
- **Customer**: `customer@example.com` / `customer123`

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Frontend (React Native)
- **iOS**: Build and deploy to App Store
- **Android**: Build APK/AAB and deploy to Google Play Store

### Backend
- Deploy to cloud platforms like AWS, Heroku, or DigitalOcean
- Use Docker for containerization
- Set up CI/CD pipeline with GitHub Actions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@foodiehub.com or join our Slack channel.

## 🎯 Roadmap

- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-restaurant ordering
- [ ] Social features (reviews, sharing)
- [ ] AI-powered recommendations
- [ ] Voice ordering
- [ ] Augmented reality menu viewing

## 🙏 Acknowledgments

- React Native community
- Open source contributors
- Design inspiration from Uber Eats, DoorDash, and Glovo
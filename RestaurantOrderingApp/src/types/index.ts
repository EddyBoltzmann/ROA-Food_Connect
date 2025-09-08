// Core Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'restaurant_owner' | 'chef' | 'admin';
  loyaltyPoints: number;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'cash_on_delivery';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface UserPreferences {
  language: 'en' | 'tw' | 'fr';
  darkMode: boolean;
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    loyalty: boolean;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  image: string;
  coverImage: string;
  address: Address;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isOpen: boolean;
  openingHours: OpeningHours[];
  features: string[];
  ownerId: string;
  menu: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dietaryTags: string[];
  isAvailable: boolean;
  customizations: Customization[];
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customization {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: SelectedCustomization[];
  totalPrice: number;
}

export interface SelectedCustomization {
  customizationId: string;
  optionIds: string[];
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: Address;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  notes?: string;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderType: 'customer' | 'chef';
  message: string;
  type: 'text' | 'image' | 'system';
  timestamp: string;
  isRead: boolean;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  validUntil?: string;
}

export interface QRCodeData {
  restaurantId: string;
  tableNumber?: string;
  type: 'restaurant' | 'table';
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  RestaurantDetail: { restaurantId: string };
  MenuItemDetail: { menuItem: MenuItem };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId: string };
  Chat: { orderId: string };
  QRScan: undefined;
  Profile: undefined;
  Loyalty: undefined;
  RestaurantDashboard: undefined;
  GlassmorphismDemo: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Chat: undefined;
  Profile: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      semiBold: string;
      bold: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
}
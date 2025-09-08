import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { RootStackParamList, MainTabParamList } from '@types/index';

// Import screens (we'll create these next)
import SplashScreen from '@screens/SplashScreen';
import OnboardingScreen from '@screens/OnboardingScreen';
import AuthScreen from '@screens/AuthScreen';
import HomeScreen from '@screens/HomeScreen';
import SearchScreen from '@screens/SearchScreen';
import OrdersScreen from '@screens/OrdersScreen';
import ChatScreen from '@screens/ChatScreen';
import ProfileScreen from '@screens/ProfileScreen';
import RestaurantDetailScreen from '@screens/RestaurantDetailScreen';
import MenuItemDetailScreen from '@screens/MenuItemDetailScreen';
import CartScreen from '@screens/CartScreen';
import CheckoutScreen from '@screens/CheckoutScreen';
import OrderTrackingScreen from '@screens/OrderTrackingScreen';
import QRScanScreen from '@screens/QRScanScreen';
import LoyaltyScreen from '@screens/LoyaltyScreen';
import RestaurantDashboardScreen from '@screens/RestaurantDashboardScreen';
import GlassmorphismDemoScreen from '@screens/GlassmorphismDemoScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#2ECC71',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="home" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="search" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="receipt" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="chat" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="user" size={size} color={color} />
          // ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useSelector(
    (state: RootState) => state.auth
  );

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="RestaurantDetail"
              component={RestaurantDetailScreen}
              options={{
                headerShown: true,
                title: 'Restaurant',
                headerStyle: {
                  backgroundColor: '#2ECC71',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Poppins-SemiBold',
                },
              }}
            />
            <Stack.Screen
              name="MenuItemDetail"
              component={MenuItemDetailScreen}
              options={{
                headerShown: true,
                title: 'Menu Item',
                headerStyle: {
                  backgroundColor: '#2ECC71',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Poppins-SemiBold',
                },
              }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{
                headerShown: true,
                title: 'Cart',
                headerStyle: {
                  backgroundColor: '#2ECC71',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Poppins-SemiBold',
                },
              }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{
                headerShown: true,
                title: 'Checkout',
                headerStyle: {
                  backgroundColor: '#2ECC71',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Poppins-SemiBold',
                },
              }}
            />
            <Stack.Screen
              name="OrderTracking"
              component={OrderTrackingScreen}
              options={{
                headerShown: true,
                title: 'Track Order',
                headerStyle: {
                  backgroundColor: '#2ECC71',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Poppins-SemiBold',
                },
              }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                headerShown: true,
                title: 'Chat',
                headerStyle: {
                  backgroundColor: '#2ECC71',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Poppins-SemiBold',
                },
              }}
            />
            <Stack.Screen
              name="QRScan"
              component={QRScanScreen}
              options={{
                headerShown: true,
                title: 'Scan QR Code',
                headerStyle: {
                  backgroundColor: '#2ECC71',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Poppins-SemiBold',
                },
              }}
            />
            <Stack.Screen
              name="Loyalty"
              component={LoyaltyScreen}
              options={{
                headerShown: true,
                title: 'Loyalty Points',
                headerStyle: {
                  backgroundColor: '#2ECC71',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Poppins-SemiBold',
                },
              }}
            />
            <Stack.Screen
              name="RestaurantDashboard"
              component={RestaurantDashboardScreen}
              options={{
                headerShown: true,
                title: 'Restaurant Dashboard',
                headerStyle: {
                  backgroundColor: '#2ECC71',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Poppins-SemiBold',
                },
              }}
            />
            <Stack.Screen
              name="GlassmorphismDemo"
              component={GlassmorphismDemoScreen}
              options={{
                headerShown: true,
                title: 'Glassmorphism Demo',
                headerStyle: {
                  backgroundColor: '#2ECC71',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Poppins-SemiBold',
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
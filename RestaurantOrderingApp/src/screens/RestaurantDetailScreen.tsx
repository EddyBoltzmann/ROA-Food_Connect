import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { 
  Card, 
  Button, 
  Rating, 
  GlassmorphismCard,
  LoadingSpinner 
} from '@components';
import { lightTheme } from '@utils/theme';
import { RootStackParamList, MenuItem, Restaurant } from '@types/index';

type RestaurantDetailScreenRouteProp = RouteProp<RootStackParamList, 'RestaurantDetail'>;
type RestaurantDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RestaurantDetail'>;

const { width } = Dimensions.get('window');

const RestaurantDetailScreen: React.FC = () => {
  const route = useRoute<RestaurantDetailScreenRouteProp>();
  const navigation = useNavigation<RestaurantDetailScreenNavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { restaurantId, tableNumber, fromQR } = route.params;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    loadRestaurantData();
  }, [restaurantId]);

  const loadRestaurantData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}`);
      const result = await response.json();
      
      if (result.success) {
        setRestaurant(result.data);
        setMenuItems(result.data.menu || []);
      } else {
        Alert.alert('Error', 'Restaurant not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading restaurant:', error);
      Alert.alert('Error', 'Failed to load restaurant data');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = () => {
    const categories = ['All'];
    menuItems.forEach(item => {
      if (item.category && !categories.includes(item.category)) {
        categories.push(item.category);
      }
    });
    return categories;
  };

  const getFilteredMenuItems = () => {
    if (selectedCategory === 'All') {
      return menuItems;
    }
    return menuItems.filter(item => item.category === selectedCategory);
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem._id === item._id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    Alert.alert('Added to Cart', `${item.name} has been added to your cart`);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <Card theme={lightTheme} style={styles.menuItemCard}>
      <View style={styles.menuItemContent}>
        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
        <View style={styles.menuItemInfo}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
          <Text style={styles.menuItemPrice}>₵{item.price}</Text>
          {item.dietaryTags && item.dietaryTags.length > 0 && (
            <View style={styles.dietaryTags}>
              {item.dietaryTags.map((tag, index) => (
                <Text key={index} style={styles.dietaryTag}>{tag}</Text>
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity
          style={[styles.addButton, !item.isAvailable && styles.disabledButton]}
          onPress={() => item.isAvailable && addToCart(item)}
          disabled={!item.isAvailable}
        >
          <Text style={styles.addButtonText}>
            {item.isAvailable ? '+' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.activeCategoryButton
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.activeCategoryButtonText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Loading restaurant...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          theme={lightTheme}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with restaurant image */}
      <View style={styles.header}>
        <Image source={{ uri: restaurant.coverImage }} style={styles.coverImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.headerGradient}
        />
        <View style={styles.headerContent}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
          <View style={styles.restaurantInfo}>
            <Rating rating={restaurant.rating} size="small" />
            <Text style={styles.ratingText}>
              {restaurant.rating} ({restaurant.reviewCount} reviews)
            </Text>
          </View>
          <View style={styles.restaurantDetails}>
            <Text style={styles.detailText}>⏱️ {restaurant.deliveryTime}</Text>
            <Text style={styles.detailText}>🚚 ₵{restaurant.deliveryFee} delivery</Text>
            <Text style={styles.detailText}>💰 Min. ₵{restaurant.minimumOrder}</Text>
          </View>
          {fromQR && tableNumber && (
            <GlassmorphismCard theme={lightTheme} style={styles.qrInfoCard}>
              <Text style={styles.qrInfoText}>
                📱 Scanned from QR Code - Table {tableNumber}
              </Text>
            </GlassmorphismCard>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {getCategories().map(renderCategoryButton)}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <FlatList
        data={getFilteredMenuItems()}
        keyExtractor={(item) => item._id}
        renderItem={renderMenuItem}
        style={styles.menuList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuListContent}
      />

      {/* Cart Summary */}
      {cart.length > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItemCount}>{getCartItemCount()} items</Text>
            <Text style={styles.cartTotal}>₵{getCartTotal().toFixed(2)}</Text>
          </View>
          <Button
            title="View Cart"
            onPress={() => navigation.navigate('Cart', { items: cart })}
            theme={lightTheme}
            style={styles.cartButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  restaurantName: {
    fontSize: lightTheme.typography.fontSize.xxl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  restaurantDescription: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    lineHeight: 20,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  qrInfoCard: {
    padding: 12,
    marginTop: 8,
  },
  qrInfoText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: lightTheme.borderRadius.full,
    backgroundColor: lightTheme.colors.surface,
    marginRight: 12,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
  },
  activeCategoryButton: {
    backgroundColor: lightTheme.colors.primary,
    borderColor: lightTheme.colors.primary,
  },
  categoryButtonText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.text,
  },
  activeCategoryButtonText: {
    color: '#FFFFFF',
  },
  menuList: {
    flex: 1,
  },
  menuListContent: {
    padding: 20,
  },
  menuItemCard: {
    marginBottom: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: lightTheme.borderRadius.md,
    marginRight: 16,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  menuItemPrice: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.primary,
    marginBottom: 8,
  },
  dietaryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dietaryTag: {
    fontSize: lightTheme.typography.fontSize.xs,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.primary,
    backgroundColor: lightTheme.colors.primary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: lightTheme.borderRadius.sm,
    marginRight: 4,
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: lightTheme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: lightTheme.colors.textSecondary,
  },
  addButtonText: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  cartSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
    ...lightTheme.shadows.sm,
  },
  cartInfo: {
    flex: 1,
  },
  cartItemCount: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
  },
  cartTotal: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.primary,
  },
  cartButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.background,
  },
  loadingText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.background,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default RestaurantDetailScreen;
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { 
  Card, 
  Button, 
  GlassmorphismCard,
  LoadingSpinner 
} from '@components';
import { lightTheme } from '@utils/theme';
import { RootStackParamList, MenuItem } from '@types/index';

type CartScreenRouteProp = RouteProp<RootStackParamList, 'Cart'>;
type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

const CartScreen: React.FC = () => {
  const route = useRoute<CartScreenRouteProp>();
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { items } = route.params;
  
  const [cartItems, setCartItems] = useState<any[]>(items || []);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item._id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item._id !== itemId));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return 5.00; // Fixed delivery fee
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }

    navigation.navigate('Checkout', {
      items: cartItems,
      subtotal: getSubtotal(),
      deliveryFee: getDeliveryFee(),
      total: getTotal(),
    });
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <Card theme={lightTheme} style={styles.cartItemCard}>
      <View style={styles.cartItemContent}>
        <Image source={{ uri: item.image }} style={styles.cartItemImage} />
        <View style={styles.cartItemInfo}>
          <Text style={styles.cartItemName}>{item.name}</Text>
          <Text style={styles.cartItemPrice}>₵{item.price}</Text>
          {item.dietaryTags && item.dietaryTags.length > 0 && (
            <View style={styles.dietaryTags}>
              {item.dietaryTags.map((tag: string, index: number) => (
                <Text key={index} style={styles.dietaryTag}>{tag}</Text>
              ))}
            </View>
          )}
        </View>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item._id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item._id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item._id)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={['#2ECC71', '#27AE60']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emptyHeader}
        >
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some delicious Ghanaian dishes to get started!
          </Text>
        </LinearGradient>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Button
            title="Browse Restaurants"
            onPress={() => navigation.navigate('Home')}
            theme={lightTheme}
            style={styles.browseButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2ECC71', '#27AE60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Your Cart</Text>
        <Text style={styles.headerSubtitle}>{cartItems.length} item(s)</Text>
      </LinearGradient>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={renderCartItem}
        style={styles.cartList}
        contentContainerStyle={styles.cartListContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <GlassmorphismCard theme={lightTheme} style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₵{getSubtotal().toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₵{getDeliveryFee().toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₵{getTotal().toFixed(2)}</Text>
          </View>
        </GlassmorphismCard>

        <Button
          title="Proceed to Checkout"
          onPress={proceedToCheckout}
          theme={lightTheme}
          style={styles.checkoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cartList: {
    flex: 1,
  },
  cartListContent: {
    padding: 20,
  },
  cartItemCard: {
    marginBottom: 16,
  },
  cartItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: lightTheme.borderRadius.md,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.primary,
    marginBottom: 4,
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
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    backgroundColor: lightTheme.colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  quantityText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: lightTheme.colors.errorRed,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  orderSummary: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
  },
  summaryCard: {
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryValue: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  checkoutButton: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  emptyHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  browseButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
});

export default CartScreen;
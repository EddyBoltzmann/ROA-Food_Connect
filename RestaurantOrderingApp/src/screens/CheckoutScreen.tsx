import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
  Input,
  GlassmorphismCard,
  LoadingSpinner 
} from '@components';
import { lightTheme } from '@utils/theme';
import { RootStackParamList } from '@types/index';

type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'Checkout'>;
type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

const CheckoutScreen: React.FC = () => {
  const route = useRoute<CheckoutScreenRouteProp>();
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { items, subtotal, deliveryFee, total } = route.params;
  
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const placeOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter your delivery address');
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod,
        specialInstructions: specialInstructions.trim(),
        subtotal,
        deliveryFee,
        total,
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          'Order Placed!',
          'Your order has been placed successfully. You will receive a confirmation shortly.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('OrderTracking', { orderId: result.data._id }),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderItemInfo}>
        <Text style={styles.orderItemName}>{item.name}</Text>
        <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.orderItemPrice}>₵{(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  const renderPaymentMethod = (method: string, title: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.paymentMethodButton,
        paymentMethod === method && styles.selectedPaymentMethod
      ]}
      onPress={() => setPaymentMethod(method)}
    >
      <Text style={styles.paymentMethodIcon}>{icon}</Text>
      <Text style={[
        styles.paymentMethodText,
        paymentMethod === method && styles.selectedPaymentMethodText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Placing your order...</Text>
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
        <Text style={styles.headerTitle}>Checkout</Text>
        <Text style={styles.headerSubtitle}>Complete your order</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <Card theme={lightTheme} style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={renderOrderItem}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.orderTotals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>₵{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Fee</Text>
              <Text style={styles.totalValue}>₵{deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotalRow]}>
              <Text style={styles.finalTotalLabel}>Total</Text>
              <Text style={styles.finalTotalValue}>₵{total.toFixed(2)}</Text>
            </View>
          </View>
        </Card>

        {/* Delivery Address */}
        <Card theme={lightTheme} style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Input
            placeholder="Enter your delivery address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            multiline
            numberOfLines={3}
            theme={lightTheme}
            style={styles.addressInput}
          />
        </Card>

        {/* Payment Method */}
        <Card theme={lightTheme} style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            {renderPaymentMethod('cash', 'Cash on Delivery', '💵')}
            {renderPaymentMethod('card', 'Credit/Debit Card', '💳')}
            {renderPaymentMethod('mobile_money', 'Mobile Money', '📱')}
          </View>
        </Card>

        {/* Special Instructions */}
        <Card theme={lightTheme} style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          <Input
            placeholder="Any special instructions for your order?"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
            theme={lightTheme}
            style={styles.instructionsInput}
          />
        </Card>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <GlassmorphismCard theme={lightTheme} style={styles.footerCard}>
          <View style={styles.footerContent}>
            <View style={styles.footerTotal}>
              <Text style={styles.footerTotalLabel}>Total</Text>
              <Text style={styles.footerTotalValue}>₵{total.toFixed(2)}</Text>
            </View>
            <Button
              title="Place Order"
              onPress={placeOrder}
              theme={lightTheme}
              style={styles.placeOrderButton}
              loading={isLoading}
            />
          </View>
        </GlassmorphismCard>
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
  content: {
    flex: 1,
  },
  section: {
    margin: 20,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.text,
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
  },
  orderItemPrice: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.primary,
  },
  orderTotals: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.text,
  },
  totalValue: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.text,
  },
  finalTotalRow: {
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 0,
  },
  finalTotalLabel: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
  },
  finalTotalValue: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.primary,
  },
  addressInput: {
    marginTop: 8,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: lightTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    backgroundColor: lightTheme.colors.surface,
  },
  selectedPaymentMethod: {
    backgroundColor: lightTheme.colors.primary,
    borderColor: lightTheme.colors.primary,
  },
  paymentMethodIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  paymentMethodText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.text,
  },
  selectedPaymentMethodText: {
    color: '#FFFFFF',
  },
  instructionsInput: {
    marginTop: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
  },
  footerCard: {
    padding: 16,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerTotal: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  footerTotalValue: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  placeOrderButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginLeft: 16,
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
});

export default CheckoutScreen;
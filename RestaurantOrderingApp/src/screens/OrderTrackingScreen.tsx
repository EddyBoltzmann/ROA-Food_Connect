import React, { useState, useEffect } from 'react';
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
  GlassmorphismCard,
  LoadingSpinner 
} from '@components';
import { lightTheme } from '@utils/theme';
import { RootStackParamList, Order } from '@types/index';

type OrderTrackingScreenRouteProp = RouteProp<RootStackParamList, 'OrderTracking'>;
type OrderTrackingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderTracking'>;

const OrderTrackingScreen: React.FC = () => {
  const route = useRoute<OrderTrackingScreenRouteProp>();
  const navigation = useNavigation<OrderTrackingScreenNavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { orderId } = route.params;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState(30);

  useEffect(() => {
    loadOrderDetails();
    // Simulate real-time updates
    const interval = setInterval(loadOrderDetails, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const result = await response.json();
      
      if (result.success) {
        setOrder(result.data);
        // Calculate estimated time based on order status
        calculateEstimatedTime(result.data.status);
      } else {
        Alert.alert('Error', 'Failed to load order details');
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEstimatedTime = (status: string) => {
    switch (status) {
      case 'Placed':
        setEstimatedTime(30);
        break;
      case 'Preparing':
        setEstimatedTime(20);
        break;
      case 'Ready':
        setEstimatedTime(10);
        break;
      case 'Out for Delivery':
        setEstimatedTime(15);
        break;
      case 'Delivered':
        setEstimatedTime(0);
        break;
      default:
        setEstimatedTime(30);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Placed':
        return '📝';
      case 'Preparing':
        return '👨‍🍳';
      case 'Ready':
        return '✅';
      case 'Out for Delivery':
        return '🚚';
      case 'Delivered':
        return '🎉';
      case 'Cancelled':
        return '❌';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Placed':
        return lightTheme.colors.primary;
      case 'Preparing':
        return '#FF8C42';
      case 'Ready':
        return '#2ECC71';
      case 'Out for Delivery':
        return '#3498DB';
      case 'Delivered':
        return '#27AE60';
      case 'Cancelled':
        return lightTheme.colors.errorRed;
      default:
        return lightTheme.colors.primary;
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

  const renderStatusStep = (status: string, isActive: boolean, isCompleted: boolean) => (
    <View key={status} style={styles.statusStep}>
      <View style={[
        styles.statusIcon,
        { backgroundColor: isActive ? getStatusColor(status) : lightTheme.colors.border },
      ]}>
        <Text style={styles.statusIconText}>{getStatusIcon(status)}</Text>
      </View>
      <Text style={[
        styles.statusText,
        { color: isActive ? getStatusColor(status) : lightTheme.colors.textSecondary }
      ]}>
        {status}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          theme={lightTheme}
        />
      </View>
    );
  }

  const statuses = ['Placed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2ECC71', '#27AE60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <Text style={styles.headerSubtitle}>Order #{order._id.slice(-6)}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <Card theme={lightTheme} style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.statusContainer}>
            {statuses.map((status, index) => 
              renderStatusStep(
                status,
                index === currentStatusIndex,
                index < currentStatusIndex
              )
            )}
          </View>
          {estimatedTime > 0 && (
            <GlassmorphismCard theme={lightTheme} style={styles.estimatedTimeCard}>
              <Text style={styles.estimatedTimeText}>
                ⏱️ Estimated delivery time: {estimatedTime} minutes
              </Text>
            </GlassmorphismCard>
          )}
        </Card>

        {/* Order Details */}
        <Card theme={lightTheme} style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>#{order._id.slice(-6)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order Time</Text>
              <Text style={styles.detailValue}>
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery Address</Text>
              <Text style={styles.detailValue}>{order.deliveryAddress}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>
                {order.paymentMethod === 'cash' ? 'Cash on Delivery' :
                 order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                 order.paymentMethod === 'mobile_money' ? 'Mobile Money' :
                 order.paymentMethod}
              </Text>
            </View>
            {order.specialInstructions && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Special Instructions</Text>
                <Text style={styles.detailValue}>{order.specialInstructions}</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Order Items */}
        <Card theme={lightTheme} style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <FlatList
            data={order.items}
            keyExtractor={(item) => item._id}
            renderItem={renderOrderItem}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.orderTotals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>₵{order.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Fee</Text>
              <Text style={styles.totalValue}>₵{order.deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotalRow]}>
              <Text style={styles.finalTotalLabel}>Total</Text>
              <Text style={styles.finalTotalValue}>₵{order.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </Card>

        {/* Contact Restaurant */}
        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
          <Card theme={lightTheme} style={styles.section}>
            <Text style={styles.sectionTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              If you have any questions about your order, you can contact the restaurant directly.
            </Text>
            <Button
              title="Contact Restaurant"
              onPress={() => navigation.navigate('Chat', { restaurantId: order.restaurantId })}
              theme={lightTheme}
              style={styles.contactButton}
            />
          </Card>
        )}
      </ScrollView>
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
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusStep: {
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIconText: {
    fontSize: 20,
  },
  statusText: {
    fontSize: lightTheme.typography.fontSize.xs,
    fontFamily: lightTheme.typography.fontFamily.medium,
    textAlign: 'center',
  },
  estimatedTimeCard: {
    padding: 16,
    alignItems: 'center',
  },
  estimatedTimeText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  orderDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.text,
    flex: 2,
    textAlign: 'right',
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
  helpText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  contactButton: {
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

export default OrderTrackingScreen;
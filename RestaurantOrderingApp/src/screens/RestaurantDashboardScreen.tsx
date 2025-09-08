import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import { 
  Card, 
  Button, 
  Input, 
  GlassmorphismCard, 
  GlassmorphismButton,
  LoadingSpinner 
} from '@components';
import { lightTheme } from '@utils/theme';
import { MenuItem, Order } from '@types/index';

const RestaurantDashboardScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'qr' | 'analytics'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    dietaryTags: '',
    isAvailable: true,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load menu items and orders
      await Promise.all([
        loadMenuItems(),
        loadOrders(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants/menu', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setMenuItems(result.data);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/restaurant', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const generateQRCode = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/qr/restaurant/restaurant-id', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setQrCodeUrl(result.data.qrCode);
        setShowQRModal(true);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      Alert.alert('Error', 'Failed to generate QR code');
    }
  };

  const addMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/restaurants/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          ...newMenuItem,
          price: parseFloat(newMenuItem.price),
          dietaryTags: newMenuItem.dietaryTags.split(',').map(tag => tag.trim()),
        }),
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', 'Menu item added successfully');
        setShowAddMenuModal(false);
        setNewMenuItem({
          name: '',
          description: '',
          price: '',
          category: '',
          imageUrl: '',
          dietaryTags: '',
          isAvailable: true,
        });
        loadMenuItems();
      } else {
        Alert.alert('Error', result.message || 'Failed to add menu item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      Alert.alert('Error', 'Failed to add menu item');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', 'Order status updated');
        loadOrders();
      } else {
        Alert.alert('Error', result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const toggleMenuItemAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/menu/${itemId}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ isAvailable }),
      });

      const result = await response.json();
      if (result.success) {
        loadMenuItems();
      }
    } catch (error) {
      console.error('Error updating menu item availability:', error);
    }
  };

  const renderTabButton = (tab: 'menu' | 'orders' | 'qr' | 'analytics', title: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabIcon, activeTab === tab && styles.activeTabIcon]}>{icon}</Text>
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderMenuItems = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Menu Items</Text>
        <GlassmorphismButton
          title="Add Item"
          onPress={() => setShowAddMenuModal(true)}
          variant="primary"
          theme={lightTheme}
          style={styles.addButton}
        />
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card theme={lightTheme} style={styles.menuItemCard}>
            <View style={styles.menuItemHeader}>
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>₵{item.price}</Text>
                <Text style={styles.menuItemCategory}>{item.category}</Text>
              </View>
              <View style={styles.menuItemActions}>
                <TouchableOpacity
                  style={[
                    styles.availabilityButton,
                    item.isAvailable ? styles.availableButton : styles.unavailableButton
                  ]}
                  onPress={() => toggleMenuItemAvailability(item._id, !item.isAvailable)}
                >
                  <Text style={styles.availabilityText}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.menuItemDescription}>{item.description}</Text>
            {item.dietaryTags && item.dietaryTags.length > 0 && (
              <View style={styles.dietaryTags}>
                {item.dietaryTags.map((tag, index) => (
                  <Text key={index} style={styles.dietaryTag}>{tag}</Text>
                ))}
              </View>
            )}
          </Card>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderOrders = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Recent Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card theme={lightTheme} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{item._id.slice(-6)}</Text>
              <Text style={styles.orderTotal}>₵{item.totalAmount}</Text>
            </View>
            <Text style={styles.orderStatus}>Status: {item.status}</Text>
            <Text style={styles.orderItems}>
              {item.items.length} item(s) • {item.items.reduce((sum, item) => sum + item.quantity, 0)} total
            </Text>
            <View style={styles.orderActions}>
              {item.status === 'Placed' && (
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() => updateOrderStatus(item._id, 'Preparing')}
                >
                  <Text style={styles.statusButtonText}>Start Preparing</Text>
                </TouchableOpacity>
              )}
              {item.status === 'Preparing' && (
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() => updateOrderStatus(item._id, 'Ready')}
                >
                  <Text style={styles.statusButtonText}>Mark Ready</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderQRCode = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>QR Code Management</Text>
      <GlassmorphismCard theme={lightTheme} style={styles.qrCard}>
        <Text style={styles.qrTitle}>Restaurant QR Code</Text>
        <Text style={styles.qrDescription}>
          Generate QR codes for your restaurant and tables. Customers can scan these codes to view your menu and place orders.
        </Text>
        <GlassmorphismButton
          title="Generate QR Code"
          onPress={generateQRCode}
          variant="primary"
          theme={lightTheme}
          style={styles.generateQRButton}
        />
      </GlassmorphismCard>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Analytics</Text>
      <View style={styles.analyticsGrid}>
        <GlassmorphismCard theme={lightTheme} style={styles.analyticsCard}>
          <Text style={styles.analyticsNumber}>{orders.length}</Text>
          <Text style={styles.analyticsLabel}>Total Orders</Text>
        </GlassmorphismCard>
        <GlassmorphismCard theme={lightTheme} style={styles.analyticsCard}>
          <Text style={styles.analyticsNumber}>{menuItems.length}</Text>
          <Text style={styles.analyticsLabel}>Menu Items</Text>
        </GlassmorphismCard>
        <GlassmorphismCard theme={lightTheme} style={styles.analyticsCard}>
          <Text style={styles.analyticsNumber}>
            {orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(0)}
          </Text>
          <Text style={styles.analyticsLabel}>Total Revenue (₵)</Text>
        </GlassmorphismCard>
        <GlassmorphismCard theme={lightTheme} style={styles.analyticsCard}>
          <Text style={styles.analyticsNumber}>
            {orders.filter(order => order.status === 'Completed').length}
          </Text>
          <Text style={styles.analyticsLabel}>Completed Orders</Text>
        </GlassmorphismCard>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
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
        <Text style={styles.headerTitle}>Restaurant Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, {user?.name}</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        {renderTabButton('menu', 'Menu', '🍽️')}
        {renderTabButton('orders', 'Orders', '📋')}
        {renderTabButton('qr', 'QR Code', '📱')}
        {renderTabButton('analytics', 'Analytics', '📊')}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'menu' && renderMenuItems()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'qr' && renderQRCode()}
        {activeTab === 'analytics' && renderAnalytics()}
      </ScrollView>

      {/* Add Menu Item Modal */}
      <Modal
        visible={showAddMenuModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Menu Item</Text>
            <TouchableOpacity onPress={() => setShowAddMenuModal(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Input
              label="Item Name *"
              placeholder="Enter item name"
              value={newMenuItem.name}
              onChangeText={(text) => setNewMenuItem({ ...newMenuItem, name: text })}
              theme={lightTheme}
            />
            <Input
              label="Description"
              placeholder="Enter item description"
              value={newMenuItem.description}
              onChangeText={(text) => setNewMenuItem({ ...newMenuItem, description: text })}
              multiline
              numberOfLines={3}
              theme={lightTheme}
            />
            <Input
              label="Price (₵) *"
              placeholder="Enter price"
              value={newMenuItem.price}
              onChangeText={(text) => setNewMenuItem({ ...newMenuItem, price: text })}
              keyboardType="numeric"
              theme={lightTheme}
            />
            <Input
              label="Category"
              placeholder="e.g., Traditional, Waakye, Banku"
              value={newMenuItem.category}
              onChangeText={(text) => setNewMenuItem({ ...newMenuItem, category: text })}
              theme={lightTheme}
            />
            <Input
              label="Image URL"
              placeholder="Enter image URL"
              value={newMenuItem.imageUrl}
              onChangeText={(text) => setNewMenuItem({ ...newMenuItem, imageUrl: text })}
              theme={lightTheme}
            />
            <Input
              label="Dietary Tags"
              placeholder="e.g., Vegetarian, Traditional, Spicy"
              value={newMenuItem.dietaryTags}
              onChangeText={(text) => setNewMenuItem({ ...newMenuItem, dietaryTags: text })}
              theme={lightTheme}
            />
          </ScrollView>
          
          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              onPress={() => setShowAddMenuModal(false)}
              variant="outline"
              theme={lightTheme}
              style={styles.modalButton}
            />
            <Button
              title="Add Item"
              onPress={addMenuItem}
              theme={lightTheme}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Restaurant QR Code</Text>
            <TouchableOpacity onPress={() => setShowQRModal(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.qrModalContent}>
            {qrCodeUrl ? (
              <Image source={{ uri: qrCodeUrl }} style={styles.qrCodeImage} />
            ) : (
              <Text style={styles.qrPlaceholder}>QR Code will appear here</Text>
            )}
            <Text style={styles.qrInstructions}>
              Display this QR code at your restaurant entrance or on tables. 
              Customers can scan it to view your menu and place orders.
            </Text>
          </View>
          
          <View style={styles.modalActions}>
            <Button
              title="Close"
              onPress={() => setShowQRModal(false)}
              theme={lightTheme}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...lightTheme.shadows.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: lightTheme.borderRadius.md,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: lightTheme.colors.primary,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  activeTabIcon: {
    color: '#FFFFFF',
  },
  tabText: {
    fontSize: lightTheme.typography.fontSize.xs,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItemCard: {
    marginBottom: 16,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
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
  menuItemPrice: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.primary,
    marginBottom: 4,
  },
  menuItemCategory: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
  },
  menuItemActions: {
    marginLeft: 12,
  },
  availabilityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: lightTheme.borderRadius.sm,
  },
  availableButton: {
    backgroundColor: lightTheme.colors.successGreen,
  },
  unavailableButton: {
    backgroundColor: lightTheme.colors.errorRed,
  },
  availabilityText: {
    fontSize: lightTheme.typography.fontSize.xs,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  menuItemDescription: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: lightTheme.borderRadius.sm,
    marginRight: 6,
    marginBottom: 4,
  },
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
  },
  orderTotal: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.primary,
  },
  orderStatus: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.textSecondary,
    marginBottom: 4,
  },
  orderItems: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    marginBottom: 12,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusButton: {
    backgroundColor: lightTheme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: lightTheme.borderRadius.sm,
  },
  statusButtonText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  qrCard: {
    padding: 20,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  qrDescription: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  generateQRButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  analyticsNumber: {
    fontSize: lightTheme.typography.fontSize.xxl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  analyticsLabel: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  modalTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
  },
  modalCloseButton: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.textSecondary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  qrModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  qrCodeImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  qrPlaceholder: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    marginBottom: 20,
  },
  qrInstructions: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RestaurantDashboardScreen;
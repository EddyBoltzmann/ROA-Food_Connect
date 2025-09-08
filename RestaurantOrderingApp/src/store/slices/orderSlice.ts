import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderStatus } from '@types/index';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: Partial<Order>, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await orderService.createOrder(orderData);
      // return response.data;
      
      // Mock response for now
      const mockOrder: Order = {
        id: `order_${Date.now()}`,
        userId: orderData.userId || 'user1',
        restaurantId: orderData.restaurantId || 'restaurant1',
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        deliveryFee: orderData.deliveryFee || 2.99,
        tax: orderData.tax || 0,
        discount: orderData.discount || 0,
        total: orderData.total || 0,
        status: 'placed',
        paymentMethod: orderData.paymentMethod || {
          id: '1',
          type: 'card',
          last4: '4242',
          brand: 'visa',
          isDefault: true,
        },
        deliveryAddress: orderData.deliveryAddress || {
          id: '1',
          label: 'Home',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          isDefault: true,
        },
        estimatedDeliveryTime: orderData.estimatedDeliveryTime || '30-40 min',
        notes: orderData.notes,
        loyaltyPointsEarned: orderData.loyaltyPointsEarned || 0,
        loyaltyPointsUsed: orderData.loyaltyPointsUsed || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return mockOrder;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (userId: string, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await orderService.getOrders(userId);
      // return response.data;
      
      // Mock data for now
      const mockOrders: Order[] = [
        {
          id: 'order_1',
          userId,
          restaurantId: 'restaurant1',
          items: [],
          subtotal: 25.98,
          deliveryFee: 2.99,
          tax: 2.60,
          discount: 0,
          total: 31.57,
          status: 'delivered',
          paymentMethod: {
            id: '1',
            type: 'card',
            last4: '4242',
            brand: 'visa',
            isDefault: true,
          },
          deliveryAddress: {
            id: '1',
            label: 'Home',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            coordinates: { latitude: 40.7128, longitude: -74.0060 },
            isDefault: true,
          },
          estimatedDeliveryTime: '30-40 min',
          actualDeliveryTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          notes: 'Please ring the doorbell',
          loyaltyPointsEarned: 32,
          loyaltyPointsUsed: 0,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'order_2',
          userId,
          restaurantId: 'restaurant2',
          items: [],
          subtotal: 18.99,
          deliveryFee: 3.99,
          tax: 1.90,
          discount: 5.00,
          total: 19.88,
          status: 'preparing',
          paymentMethod: {
            id: '1',
            type: 'card',
            last4: '4242',
            brand: 'visa',
            isDefault: true,
          },
          deliveryAddress: {
            id: '1',
            label: 'Home',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            coordinates: { latitude: 40.7128, longitude: -74.0060 },
            isDefault: true,
          },
          estimatedDeliveryTime: '25-35 min',
          notes: 'Extra spicy please',
          loyaltyPointsEarned: 20,
          loyaltyPointsUsed: 5,
          createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          updatedAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ];
      
      return mockOrders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await orderService.getOrderById(orderId);
      // return response.data;
      
      // Mock data for now
      const mockOrder: Order = {
        id: orderId,
        userId: 'user1',
        restaurantId: 'restaurant1',
        items: [],
        subtotal: 25.98,
        deliveryFee: 2.99,
        tax: 2.60,
        discount: 0,
        total: 31.57,
        status: 'preparing',
        paymentMethod: {
          id: '1',
          type: 'card',
          last4: '4242',
          brand: 'visa',
          isDefault: true,
        },
        deliveryAddress: {
          id: '1',
          label: 'Home',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          isDefault: true,
        },
        estimatedDeliveryTime: '30-40 min',
        notes: 'Please ring the doorbell',
        loyaltyPointsEarned: 32,
        loyaltyPointsUsed: 0,
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
      };
      
      return mockOrder;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: OrderStatus }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await orderService.updateOrderStatus(orderId, status);
      // return response.data;
      
      // Mock response for now
      return { orderId, status };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const orderIndex = state.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = status;
          state.orders[orderIndex].updatedAt = new Date().toISOString();
        }
        if (state.currentOrder && state.currentOrder.id === orderId) {
          state.currentOrder.status = status;
          state.currentOrder.updatedAt = new Date().toISOString();
        }
      });
  },
});

export const { setCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
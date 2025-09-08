import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant, MenuItem } from '@types/index';

interface RestaurantState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCuisine: string | null;
  sortBy: 'rating' | 'deliveryTime' | 'deliveryFee' | 'name';
}

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  menuItems: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCuisine: null,
  sortBy: 'rating',
};

// Async thunks
export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await restaurantService.getRestaurants();
      // return response.data;
      
      // Mock data for now
      const mockRestaurants: Restaurant[] = [
        {
          id: '1',
          name: 'Bella Vista Restaurant',
          description: 'Authentic Italian cuisine with fresh ingredients',
          cuisine: ['Italian', 'Pizza', 'Pasta'],
          rating: 4.5,
          reviewCount: 128,
          deliveryTime: '25-35 min',
          deliveryFee: 2.99,
          minimumOrder: 15.00,
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          address: {
            id: '1',
            label: 'Main Location',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            coordinates: { latitude: 40.7128, longitude: -74.0060 },
            isDefault: true,
          },
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          isOpen: true,
          openingHours: [
            { day: 'Monday', open: '09:00', close: '22:00', isClosed: false },
            { day: 'Tuesday', open: '09:00', close: '22:00', isClosed: false },
            { day: 'Wednesday', open: '09:00', close: '22:00', isClosed: false },
            { day: 'Thursday', open: '09:00', close: '22:00', isClosed: false },
            { day: 'Friday', open: '09:00', close: '23:00', isClosed: false },
            { day: 'Saturday', open: '10:00', close: '23:00', isClosed: false },
            { day: 'Sunday', open: '10:00', close: '21:00', isClosed: false },
          ],
          features: ['Delivery', 'Takeout', 'Dine-in'],
          ownerId: 'owner1',
          menu: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Spice Garden',
          description: 'Authentic Indian cuisine with aromatic spices',
          cuisine: ['Indian', 'Curry', 'Vegetarian'],
          rating: 4.3,
          reviewCount: 89,
          deliveryTime: '30-40 min',
          deliveryFee: 3.99,
          minimumOrder: 20.00,
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          coverImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
          address: {
            id: '2',
            label: 'Main Location',
            street: '456 Oak Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            country: 'USA',
            coordinates: { latitude: 40.7589, longitude: -73.9851 },
            isDefault: true,
          },
          coordinates: { latitude: 40.7589, longitude: -73.9851 },
          isOpen: true,
          openingHours: [
            { day: 'Monday', open: '11:00', close: '23:00', isClosed: false },
            { day: 'Tuesday', open: '11:00', close: '23:00', isClosed: false },
            { day: 'Wednesday', open: '11:00', close: '23:00', isClosed: false },
            { day: 'Thursday', open: '11:00', close: '23:00', isClosed: false },
            { day: 'Friday', open: '11:00', close: '24:00', isClosed: false },
            { day: 'Saturday', open: '11:00', close: '24:00', isClosed: false },
            { day: 'Sunday', open: '12:00', close: '22:00', isClosed: false },
          ],
          features: ['Delivery', 'Takeout', 'Dine-in'],
          ownerId: 'owner2',
          menu: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      return mockRestaurants;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch restaurants');
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurant/fetchRestaurantById',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await restaurantService.getRestaurantById(restaurantId);
      // return response.data;
      
      // Mock data for now
      const mockRestaurant: Restaurant = {
        id: restaurantId,
        name: 'Bella Vista Restaurant',
        description: 'Authentic Italian cuisine with fresh ingredients',
        cuisine: ['Italian', 'Pizza', 'Pasta'],
        rating: 4.5,
        reviewCount: 128,
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        minimumOrder: 15.00,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        address: {
          id: '1',
          label: 'Main Location',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          isDefault: true,
        },
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        isOpen: true,
        openingHours: [
          { day: 'Monday', open: '09:00', close: '22:00', isClosed: false },
          { day: 'Tuesday', open: '09:00', close: '22:00', isClosed: false },
          { day: 'Wednesday', open: '09:00', close: '22:00', isClosed: false },
          { day: 'Thursday', open: '09:00', close: '22:00', isClosed: false },
          { day: 'Friday', open: '09:00', close: '23:00', isClosed: false },
          { day: 'Saturday', open: '10:00', close: '23:00', isClosed: false },
          { day: 'Sunday', open: '10:00', close: '21:00', isClosed: false },
        ],
        features: ['Delivery', 'Takeout', 'Dine-in'],
        ownerId: 'owner1',
        menu: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return mockRestaurant;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch restaurant');
    }
  }
);

export const fetchMenuItems = createAsyncThunk(
  'restaurant/fetchMenuItems',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await restaurantService.getMenuItems(restaurantId);
      // return response.data;
      
      // Mock data for now
      const mockMenuItems: MenuItem[] = [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Fresh mozzarella, tomato sauce, and basil',
          price: 16.99,
          image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
          category: 'Pizza',
          dietaryTags: ['Vegetarian'],
          isAvailable: true,
          customizations: [],
          restaurantId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Spaghetti Carbonara',
          description: 'Classic Italian pasta with eggs, cheese, and pancetta',
          price: 18.99,
          image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
          category: 'Pasta',
          dietaryTags: [],
          isAvailable: true,
          customizations: [],
          restaurantId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with parmesan and croutons',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
          category: 'Salads',
          dietaryTags: ['Vegetarian'],
          isAvailable: true,
          customizations: [],
          restaurantId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      return mockMenuItems;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch menu items');
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCuisine: (state, action: PayloadAction<string | null>) => {
      state.selectedCuisine = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'rating' | 'deliveryTime' | 'deliveryFee' | 'name'>) => {
      state.sortBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurants = action.payload;
        state.error = null;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch restaurant by ID
      .addCase(fetchRestaurantById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRestaurant = action.payload;
        state.error = null;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch menu items
      .addCase(fetchMenuItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menuItems = action.payload;
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, setSelectedCuisine, setSortBy, clearError } = restaurantSlice.actions;
export default restaurantSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@types/index';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasCompletedOnboarding: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await authService.login(credentials);
      // return response.data;
      
      // Mock response for now
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'John Doe',
        phone: '+1234567890',
        role: 'customer',
        loyaltyPoints: 150,
        addresses: [],
        paymentMethods: [],
        preferences: {
          language: 'en',
          darkMode: false,
          notifications: {
            orderUpdates: true,
            promotions: true,
            loyalty: true,
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return mockUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { 
    email: string; 
    password: string; 
    name: string; 
    role?: 'customer' | 'restaurant_owner';
    phone?: string;
    restaurantName?: string;
    restaurantAddress?: string;
  }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await authService.register(userData);
      // return response.data;
      
      // Mock response for now
      const mockUser: User = {
        id: '1',
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role || 'customer',
        loyaltyPoints: 0,
        addresses: [],
        paymentMethods: [],
        preferences: {
          language: 'en',
          darkMode: false,
          notifications: {
            orderUpdates: true,
            promotions: true,
            loyalty: true,
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return mockUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // await authService.logout();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.hasCompletedOnboarding = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setOnboardingCompleted, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
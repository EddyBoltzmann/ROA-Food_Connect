import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LoyaltyReward } from '@types/index';

interface LoyaltyState {
  points: number;
  rewards: LoyaltyReward[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LoyaltyState = {
  points: 0,
  rewards: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchLoyaltyPoints = createAsyncThunk(
  'loyalty/fetchLoyaltyPoints',
  async (userId: string, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await loyaltyService.getPoints(userId);
      // return response.data;
      
      // Mock response for now
      return 150;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch loyalty points');
    }
  }
);

export const fetchLoyaltyRewards = createAsyncThunk(
  'loyalty/fetchLoyaltyRewards',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await loyaltyService.getRewards();
      // return response.data;
      
      // Mock data for now
      const mockRewards: LoyaltyReward[] = [
        {
          id: '1',
          name: '10% Off Next Order',
          description: 'Get 10% discount on your next order',
          pointsRequired: 100,
          discountType: 'percentage',
          discountValue: 10,
          isActive: true,
        },
        {
          id: '2',
          name: '$5 Off',
          description: 'Get $5 off your order',
          pointsRequired: 200,
          discountType: 'fixed',
          discountValue: 5,
          isActive: true,
        },
        {
          id: '3',
          name: 'Free Delivery',
          description: 'Free delivery on your next order',
          pointsRequired: 150,
          discountType: 'fixed',
          discountValue: 3.99,
          isActive: true,
        },
      ];
      
      return mockRewards;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch loyalty rewards');
    }
  }
);

export const redeemReward = createAsyncThunk(
  'loyalty/redeemReward',
  async ({ rewardId, userId }: { rewardId: string; userId: string }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await loyaltyService.redeemReward(rewardId, userId);
      // return response.data;
      
      // Mock response for now
      return { rewardId, pointsUsed: 100 };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to redeem reward');
    }
  }
);

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    addPoints: (state, action: PayloadAction<number>) => {
      state.points += action.payload;
    },
    subtractPoints: (state, action: PayloadAction<number>) => {
      state.points = Math.max(0, state.points - action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch loyalty points
      .addCase(fetchLoyaltyPoints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoyaltyPoints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.points = action.payload;
        state.error = null;
      })
      .addCase(fetchLoyaltyPoints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch loyalty rewards
      .addCase(fetchLoyaltyRewards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoyaltyRewards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rewards = action.payload;
        state.error = null;
      })
      .addCase(fetchLoyaltyRewards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Redeem reward
      .addCase(redeemReward.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(redeemReward.fulfilled, (state, action) => {
        state.isLoading = false;
        state.points -= action.payload.pointsUsed;
        state.error = null;
      })
      .addCase(redeemReward.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addPoints, subtractPoints, clearError } = loyaltySlice.actions;
export default loyaltySlice.reducer;
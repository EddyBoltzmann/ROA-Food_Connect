import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, MenuItem, SelectedCustomization } from '@types/index';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ menuItem: MenuItem; customizations: SelectedCustomization[] }>) => {
      const { menuItem, customizations } = action.payload;
      
      // Calculate customizations price
      const customizationsPrice = customizations.reduce((total, customization) => {
        return total + customization.optionIds.reduce((optionTotal, optionId) => {
          // Find the option price (this would come from the menu item data)
          // For now, we'll use a default price
          return optionTotal + 1.00; // Default customization price
        }, 0);
      }, 0);
      
      const totalPrice = menuItem.price + customizationsPrice;
      
      // Check if item with same customizations already exists
      const existingItemIndex = state.items.findIndex(item => 
        item.menuItem.id === menuItem.id &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        state.items[existingItemIndex].quantity += 1;
        state.items[existingItemIndex].totalPrice = state.items[existingItemIndex].quantity * totalPrice;
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          id: `${menuItem.id}-${Date.now()}`,
          menuItem,
          quantity: 1,
          customizations,
          totalPrice,
        };
        state.items.push(newCartItem);
      }
      
      // Update totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + item.totalPrice, 0);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      // Update totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + item.totalPrice, 0);
    },
    
    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          // Update quantity
          item.quantity = quantity;
          item.totalPrice = item.quantity * (item.menuItem.price + 
            item.customizations.reduce((total, customization) => {
              return total + customization.optionIds.length * 1.00; // Default customization price
            }, 0));
        }
        
        // Update totals
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
        state.total = state.items.reduce((total, item) => total + item.totalPrice, 0);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
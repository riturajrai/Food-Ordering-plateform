import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  count: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action) {
      console.log('setCartItems called with:', action.payload);
      state.items = action.payload;
      state.count = action.payload.reduce((sum, item) => sum + Number(item.quantity), 0);
    },
    addItem(state, action) {
      console.log('addItem called with:', action.payload);
      const item = action.payload;
      const existingItem = state.items.find((i) => i.product_id === item.product_id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      state.count = state.items.reduce((sum, item) => sum + Number(item.quantity), 0);
    },
    incrementQuantity(state, action) {
      const { id } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity += 1;
        state.count += 1;
      }
    },
    decrementQuantity(state, action) {
      const { id } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.count -= 1;
      } else if (item) {
        state.count -= item.quantity;
        state.items = state.items.filter((i) => i.id !== id);
      }
    },
    removeItem(state, action) {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        state.count -= item.quantity;
        state.items = state.items.filter((i) => i.id !== id);
      }
    },
    clearCart(state) {
      state.items = [];
      state.count = 0;
    },
  },
});

export const { setCartItems, addItem, incrementQuantity, decrementQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
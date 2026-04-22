import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('zan_cafe_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (err) {
    return [];
  }
};

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.items.push({ ...item, qty: 1 });
      }
      localStorage.setItem('zan_cafe_cart', JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem('zan_cafe_cart', JSON.stringify(state.items));
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.qty = Math.max(0, qty);
        if (item.qty === 0) {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }
      localStorage.setItem('zan_cafe_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('zan_cafe_cart');
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

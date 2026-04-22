import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: 'Zan Guest',
    email: 'guest@zancafe.com',
    phone: '+91 98765 43210',
    loyaltyPoints: 150,
  },
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateLoyaltyPoints: (state, action) => {
      if (state.user) {
        state.user.loyaltyPoints += action.payload;
      }
    },
  },
});

export const { setUser, logout, updateLoyaltyPoints } = authSlice.actions;
export default authSlice.reducer;

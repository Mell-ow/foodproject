import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCategory: 'All',
  imagePadding: {}, // Cache for Unsplash images { itemName: imageUrl }
  loading: false,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    cacheImage: (state, action) => {
      const { name, url } = action.payload;
      state.imagePadding[name] = url;
    },
  },
});

export const { setActiveCategory, cacheImage } = menuSlice.actions;
export default menuSlice.reducer;

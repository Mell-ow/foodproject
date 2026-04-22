import { create } from 'zustand';

const useMenuStore = create((set, get) => ({
  activeCategory: 'All',
  // Cache: { [itemId]: imageUrl }
  imageCache: {},

  setActiveCategory: (category) => set({ activeCategory: category }),

  setImageCache: (id, url) =>
    set((state) => ({
      imageCache: { ...state.imageCache, [id]: url },
    })),
}));

export default useMenuStore;

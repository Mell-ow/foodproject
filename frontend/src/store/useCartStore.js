import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Flat cart item shape: { id, name, price, category, qty, image }
 * Compatible with FoodCard.jsx addItem and CartDrawer rendering.
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Add an item (or increment qty if already in cart).
       * @param {Object} item - must have { id, name, price, category, qty?, image? }
       */
      addItem: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, qty: item.qty || 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      /** Total price in ₹ */
      getTotalAmount: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
      },

      /** Total item count (sum of quantities) */
      getItemsCount: () => {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },
    }),
    {
      name: 'zan-cafe-cart-v2', // new key avoids conflict with old nested structure
    }
  )
);

export default useCartStore;

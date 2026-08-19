import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, MenuItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  toggleItem: (item: MenuItem) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const current = state.items.find((entry) => entry.id === item.id);

          if (current) {
            return {
              items: state.items.map((entry) =>
                entry.id === item.id
                  ? { ...entry, quantity: entry.quantity + 1 }
                  : entry,
              ),
            };
          }

          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      toggleItem: (item) =>
        set((state) => {
          const isSelected = state.items.some((entry) => entry.id === item.id);

          return {
            items: isSelected
              ? state.items.filter((entry) => entry.id !== item.id)
              : [...state.items, { ...item, quantity: 1 }],
          };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "order-food-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, FoodOrder } from "@/types";

interface OrderStore {
  orders: FoodOrder[];
  createOrder: (items: CartItem[], remark: string) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      createOrder: (items, remark) =>
        set((state) => ({
          orders: [
            {
              id: crypto.randomUUID(),
              orderNo: `OF${Date.now().toString().slice(-10)}`,
              items,
              remark,
              status: "pending_confirmation",
              createdAt: new Date().toISOString(),
            },
            ...state.orders,
          ],
        })),
    }),
    { name: "order-food-orders", storage: createJSONStorage(() => localStorage) },
  ),
);

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserDish } from "@/types";

interface DishStore {
  dishes: UserDish[];
  addDish: (dish: UserDish) => void;
}

export const useDishStore = create<DishStore>()(
  persist(
    (set) => ({
      dishes: [],
      addDish: (dish) => set((state) => ({ dishes: [dish, ...state.dishes] })),
    }),
    { name: "order-food-user-dishes", storage: createJSONStorage(() => localStorage) },
  ),
);

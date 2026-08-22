import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ApiFamily } from "@/types";

interface FamilyStore {
  families: ApiFamily[];
  currentFamilyId: string | null;
  setFamilies: (families: ApiFamily[]) => void;
  upsertFamily: (family: ApiFamily) => void;
  setCurrentFamily: (familyId: string | null) => void;
}

export const useFamilyStore = create<FamilyStore>()(
  persist(
    (set) => ({
      families: [],
      currentFamilyId: null,
      setFamilies: (families) =>
        set({ families: Array.isArray(families) ? families : [] }),
      upsertFamily: (family) =>
        set((state) => ({
          families: state.families.some((item) => item.id === family.id)
            ? state.families.map((item) =>
                item.id === family.id ? family : item,
              )
            : [...state.families, family],
        })),
      setCurrentFamily: (familyId) =>
        set((state) => ({
          currentFamilyId:
            familyId && state.families.some((item) => item.id === familyId)
              ? familyId
              : (familyId ?? null),
        })),
    }),
    {
      name: "order-food-family",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<FamilyStore>;
        return {
          ...currentState,
          ...persisted,
          families: Array.isArray(persisted.families)
            ? persisted.families
            : [],
        };
      },
    },
  ),
);

export function getCurrentFamilyId(): string | null {
  return useFamilyStore.getState().currentFamilyId;
}

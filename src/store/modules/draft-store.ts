import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, MenuDraft } from "@/types";
import { nanoid } from "nanoid";

interface DraftStore {
  drafts: MenuDraft[];
  saveDraft: (items: CartItem[]) => void;
  updateDraft: (id: string, items: CartItem[]) => void;
  removeDraft: (id: string) => void;
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set) => ({
      drafts: [],
      saveDraft: (items) =>
        set((state) => ({
          drafts: [
            {
              id: nanoid(),
              items,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.drafts,
          ],
        })),
      updateDraft: (id, items) =>
        set((state) => ({
          drafts: state.drafts.map((draft) =>
            draft.id === id
              ? { ...draft, items, updatedAt: new Date().toISOString() }
              : draft,
          ),
        })),
      removeDraft: (id) =>
        set((state) => ({
          drafts: state.drafts.filter((draft) => draft.id !== id),
        })),
    }),
    { name: "order-food-drafts", storage: createJSONStorage(() => localStorage) },
  ),
);

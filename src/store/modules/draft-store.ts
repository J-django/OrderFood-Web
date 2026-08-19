import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DishDraft } from "@/types";

interface DraftStore {
  drafts: DishDraft[];
  saveDraft: (draft: Omit<DishDraft, "id" | "updatedAt">) => void;
  updateDraft: (id: string, draft: Omit<DishDraft, "id" | "updatedAt">) => void;
  removeDraft: (id: string) => void;
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set) => ({
      drafts: [],
      saveDraft: (draft) =>
        set((state) => ({
          drafts: [
            {
              ...draft,
              id: crypto.randomUUID(),
              updatedAt: new Date().toISOString(),
            },
            ...state.drafts,
          ],
        })),
      updateDraft: (id, draft) =>
        set((state) => ({
          drafts: state.drafts.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  ...draft,
                  updatedAt: new Date().toISOString(),
                }
              : entry,
          ),
        })),
      removeDraft: (id) =>
        set((state) => ({
          drafts: state.drafts.filter((draft) => draft.id !== id),
        })),
    }),
    {
      name: "order-food-drafts",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

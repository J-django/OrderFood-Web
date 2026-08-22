import type { CartItem } from "./menu";

export interface MenuDraft {
  id: string;
  name?: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

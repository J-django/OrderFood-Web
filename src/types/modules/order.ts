import type { CartItem } from "./menu";

export interface FoodOrder {
  id: string;
  orderNo: string;
  items: CartItem[];
  remark: string;
  status: "pending_confirmation";
  createdAt: string;
}

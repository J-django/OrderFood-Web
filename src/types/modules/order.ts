import type { ApiOrderStatus } from "./api-domain";
import type { CartItem } from "./menu";

export interface FoodOrder {
  id: string;
  orderNo: string;
  items: CartItem[];
  remark: string;
  status: ApiOrderStatus;
  createdAt: string;
}

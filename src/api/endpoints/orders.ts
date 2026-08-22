import { get, post } from "@/api/modules/methods";
import { asArray } from "@/api/endpoints/adapters";
import type { ApiOrder, CreateOrderPayload } from "@/types";

export function getOrders() {
  return get<{ items: ApiOrder[] }>("/orders").then((result) => ({
    items: asArray<ApiOrder>(result?.items),
  }));
}

export function createOrder(payload: CreateOrderPayload) {
  return post<ApiOrder, CreateOrderPayload>("/orders", { data: payload });
}

export function getOrder(orderId: string) {
  return get<ApiOrder>(`/orders/${orderId}`);
}

export function repeatOrder(orderId: string) {
  return post<ApiOrder>(`/orders/${orderId}/repeat`);
}

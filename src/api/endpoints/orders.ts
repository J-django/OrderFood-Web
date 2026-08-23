import { post } from "@/api/modules/methods";
import { asArray } from "@/api/endpoints/adapters";
import type { ApiOrder, CreateOrderPayload } from "@/types";

export function getOrders() {
  return post<{ items: ApiOrder[] }>("/getOrders").then((result) => ({
    items: asArray<ApiOrder>(result?.items),
  }));
}

export function createOrder(payload: CreateOrderPayload) {
  return post<ApiOrder, CreateOrderPayload>("/addOrder", { data: payload });
}

export function getOrder(orderId: string) {
  return post<ApiOrder, { orderId: string }>("/getOrder", {
    data: { orderId },
  });
}

export function repeatOrder(orderId: string) {
  return post<ApiOrder, { orderId: string }>("/repeatOrder", {
    data: { orderId },
  });
}

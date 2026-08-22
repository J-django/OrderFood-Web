import { del, get, patch, post } from "@/api/modules/methods";
import { asArray } from "@/api/endpoints/adapters";
import type {
  ApiDish,
  ApiMenuCategory,
  CreateDishPayload,
  MenuListParams,
  MenuListResult,
} from "@/types";

export interface DeleteMenuCategoryResult {
  deleted: true;
}

export function getMenu(params?: MenuListParams) {
  return get<MenuListResult>("/menu", { params }).then((result) => ({
    categories: asArray<ApiMenuCategory>(result?.categories),
    items: asArray<ApiDish>(result?.items),
  }));
}

export function getMenuCategories() {
  return get<{ items: ApiMenuCategory[] }>("/menu/categories").then(
    (result) => ({ items: asArray<ApiMenuCategory>(result?.items) }),
  );
}

export function createMenuCategory(payload: { name: string }) {
  return post<ApiMenuCategory, { name: string }>("/menu/categories", {
    data: payload,
  });
}

export function updateMenuCategory(id: string, payload: { name: string }) {
  return patch<ApiMenuCategory, { name: string }>(`/menu/categories/${id}`, {
    data: payload,
  });
}

export function deleteMenuCategory(id: string) {
  return del<DeleteMenuCategoryResult>(`/menu/categories/${id}`);
}

export function getDishes(params?: MenuListParams) {
  return get<{ items: ApiDish[] }>("/menu/dishes", { params }).then(
    (result) => ({ items: asArray<ApiDish>(result?.items) }),
  );
}

export function getDish(dishId: string) {
  return get<ApiDish>(`/menu/dishes/${dishId}`);
}

export function createDish(payload: CreateDishPayload) {
  return post<ApiDish, CreateDishPayload>("/menu/dishes", { data: payload });
}

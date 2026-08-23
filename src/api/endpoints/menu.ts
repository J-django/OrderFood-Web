import { post } from "@/api/modules/methods";
import { asArray } from "@/api/endpoints/adapters";
import type {
  ApiDish,
  ApiMenuCategory,
  CreateCategoryPayload,
  CreateDishPayload,
  MenuListParams,
  MenuListResult,
  UpdateDishPayload,
  UpdateCategoryOrderPayload,
  UpdateCategoryPayload,
} from "@/types";

export interface DeleteMenuCategoryResult {
  deleted: true;
}

export function getMenu(params?: MenuListParams) {
  return post<MenuListResult, MenuListParams>("/getMenu", {
    data: params ?? {},
  }).then((result) => ({
    categories: asArray<ApiMenuCategory>(result?.categories),
    items: asArray<ApiDish>(result?.items),
  }));
}

export function getMenuCategories() {
  return post<{ items: ApiMenuCategory[] }>("/getCategories").then(
    (result) => ({ items: asArray<ApiMenuCategory>(result?.items) }),
  );
}

export function createMenuCategory(payload: CreateCategoryPayload) {
  return post<ApiMenuCategory, CreateCategoryPayload>("/addCategory", {
    data: payload,
  });
}

export function updateMenuCategory(
  id: string,
  payload: Omit<UpdateCategoryPayload, "categoryId">,
) {
  return post<ApiMenuCategory, UpdateCategoryPayload>("/modifyCategory", {
    data: { categoryId: id, ...payload },
  });
}

export function updateMenuCategoryOrder(categoryIds: string[]) {
  return post<ApiMenuCategory[], UpdateCategoryOrderPayload>(
    "/modifyCategoryOrder",
    {
      data: { categoryIds },
    },
  );
}

export function deleteMenuCategory(id: string) {
  return post<DeleteMenuCategoryResult, { categoryId: string }>(
    "/removeCategory",
    {
      data: { categoryId: id },
    },
  );
}

export function getDishes(params?: MenuListParams) {
  return post<{ items: ApiDish[] }, MenuListParams>("/getDishes", {
    data: params ?? {},
  }).then((result) => ({
    items: asArray<ApiDish>(result?.items),
  }));
}

export function getDish(dishId: string) {
  return post<ApiDish, { dishId: string }>("/getDish", {
    data: { dishId },
  });
}

export function createDish(payload: CreateDishPayload) {
  return post<ApiDish, CreateDishPayload>("/addDish", { data: payload });
}

export function updateDish(
  dishId: string,
  payload: Omit<UpdateDishPayload, "dishId">,
) {
  return post<ApiDish, UpdateDishPayload>("/modifyDish", {
    data: { dishId, ...payload },
  });
}

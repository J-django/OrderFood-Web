import type {
  ApiDish,
  ApiDraft,
  ApiMenuCategory,
  ApiOrder,
  MenuCategory,
  MenuItem,
  MenuDraft,
  FoodOrder,
} from "@/types";

const FALLBACK_DISH_IMAGE = "/images/menu/garden-salad.jpg";

export const defaultMenuCategory: MenuCategory = "其他";

/**
 * 后端部分列表接口当前会把 Promise 序列化为空对象（见 API.md「当前实现说明」），
 * 这里统一兜底为数组，避免调用方对非数组执行 .map 报错。
 */
export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function dishToMenuItem(dish: ApiDish): MenuItem {
  return {
    id: dish.id,
    name: dish.name,
    category: (dish.category?.name as MenuCategory) || defaultMenuCategory,
    price: 0,
    image: dish.images?.[0] || FALLBACK_DISH_IMAGE,
    ingredients: dish.ingredients ?? "",
    seasonings: dish.garnishes ?? "",
    method: dish.method ?? "",
  };
}

export function dishListToMenuItems(dishes: ApiDish[] | undefined) {
  return (dishes ?? []).map(dishToMenuItem);
}

export function draftToMenuDraft(draft: ApiDraft): MenuDraft {
  return {
    id: draft.id,
    name: draft.name,
    items: dishListToMenuItems(draft.menu).map((item) => ({
      ...item,
      quantity: 1,
    })),
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
  };
}

export function orderToFoodOrder(order: ApiOrder): FoodOrder {
  return {
    id: order.id,
    orderNo: order.orderNo,
    items: dishListToMenuItems(order.dishes).map((item) => ({
      ...item,
      quantity: 1,
    })),
    remark: order.note ?? "",
    status: order.status,
    createdAt: order.createdAt,
  };
}

export function buildCategoryTabs(
  categories: ApiMenuCategory[],
): Array<{ id: string; name: string }> {
  return [{ id: "all", name: "全部" }, ...categories];
}

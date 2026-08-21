export type MenuCategory = "主食" | "小吃" | "饮品" | "其他";

export interface MenuItem {
  id: string
  name: string
  category: MenuCategory
  price: number
  image: string
  ingredients: string
  seasonings: string
  method: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

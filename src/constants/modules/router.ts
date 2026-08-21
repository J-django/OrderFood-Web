import { lazyPage } from "@/router/modules/lazy-page";
import type { RouteConfig } from "@/types";

const menuPath = "/menu";
const profilePath = "/profile";
const familiesPath = `${profilePath}/families`;
const dishesPath = `${profilePath}/dishes`;

export const routePaths = {
  home: "/",
  menu: menuPath,
  menuDetail: (itemId: string) => `${menuPath}/${encodeURIComponent(itemId)}`,
  drafts: "/drafts",
  orderConfirm: "/order/confirm",
  profile: profilePath,
  families: familiesPath,
  familyDetail: (familyId: string) =>
    `${familiesPath}/${encodeURIComponent(familyId)}`,
  orders: `${profilePath}/orders`,
  addDish: `${dishesPath}/new`,
  editDish: (draftId: string) =>
    `${dishesPath}/new?draft=${encodeURIComponent(draftId)}`,
} as const;

export const routeConfigs: RouteConfig[] = [
  {
    path: "/",
    load: lazyPage(() => import("@/layout")),
    children: [
      {
        index: true,
        load: lazyPage(() => import("@/pages/home")),
        handle: { title: "菜单" },
      },
      {
        path: "menu/:itemId",
        load: lazyPage(() => import("@/pages/menu-detail")),
        handle: { title: "菜品详情" },
      },
      {
        path: "drafts",
        load: lazyPage(() => import("@/pages/drafts")),
        handle: { title: "草稿" },
      },
      {
        path: "order/confirm",
        load: lazyPage(() => import("@/pages/order-confirm")),
        handle: { title: "订单确认" },
      },
      {
        path: "profile",
        load: lazyPage(() => import("@/pages/profile")),
        handle: { title: "我的" },
      },
      {
        path: "profile/families",
        load: lazyPage(() => import("@/pages/families")),
        handle: { title: "我的家庭" },
      },
      {
        path: "profile/families/:familyId",
        load: lazyPage(() => import("@/pages/family-detail")),
        handle: { title: "家庭详情" },
      },
      {
        path: "profile/orders",
        load: lazyPage(() => import("@/pages/orders")),
        handle: { title: "我的订单" },
      },
      {
        path: "profile/dishes/new",
        load: lazyPage(() => import("@/pages/add-dish")),
        handle: { title: "添加菜品" },
      },
    ],
  },
  {
    path: "*",
    load: lazyPage(() => import("@/pages/not-found")),
    handle: { title: "页面未找到" },
  },
];

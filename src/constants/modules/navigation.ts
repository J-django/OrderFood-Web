import { routePaths } from "./router";

export const bottomNavigation = [
  { label: "菜单", path: routePaths.home, icon: "icon-[lucide--utensils]" },
  {
    label: "草稿",
    path: routePaths.drafts,
    icon: "icon-[lucide--notebook-pen]",
  },
  {
    label: "我的",
    path: routePaths.profile,
    icon: "icon-[lucide--user-round]",
  },
] as const;

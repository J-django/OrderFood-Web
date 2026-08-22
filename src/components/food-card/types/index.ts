import type { MenuItem } from "@/types";

export type FoodCardImageSize = "sm" | "md" | "lg";

export interface FoodCardProps {
  item: MenuItem;
  keyword?: string;
  selected?: boolean;
  onToggle?: (item: MenuItem) => void;
  linkTo?: string;
  imageSize?: FoodCardImageSize;
  compact?: boolean;
  truncateDetail?: boolean;
  emptyDetailText?: string;
  onClick?: () => void;
  className?: string;
}

import { cn } from "@/utils";
import type { ActionButtonProps } from "../types";

const variantClasses = {
  primary: "bg-(--theme-color)/10 text-(--theme-color)",
  info: "bg-stone-100 text-stone-700 active:bg-stone-200",
  danger: "bg-(--lc-red)/10 text-(--lc-red)/90",
} as const;

export function ActionButton({
  variant = "primary",
  className,
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
    />
  );
}

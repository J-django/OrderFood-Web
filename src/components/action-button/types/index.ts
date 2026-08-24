import type { ComponentProps } from "react";

export type ActionButtonVariant = "primary" | "info" | "danger";

export type ActionButtonProps = ComponentProps<"button"> & {
  variant?: ActionButtonVariant;
};

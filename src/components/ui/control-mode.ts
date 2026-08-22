type ControlMode = "default" | "control";

const controlModeClassNames: Record<ControlMode, string> = {
  default: "",
  control:
    "border-none bg-muted hover:bg-muted/80 dark:bg-input/30 dark:hover:bg-input/50 hover:text-foreground text-[color:inherit]",
};

export { controlModeClassNames };
export type { ControlMode };

import * as React from "react";
import { controlModeClassNames } from "./control-mode";
import { cn } from "@/utils";
import type { ControlMode } from "./control-mode";

function Textarea({
  className,
  mode = "default",
  ...props
}: React.ComponentProps<"textarea"> & {
  mode?: ControlMode;
}) {
  return (
    <textarea
      data-slot="textarea"
      data-lc-mode={mode}
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
        controlModeClassNames[mode],
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

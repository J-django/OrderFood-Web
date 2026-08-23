import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { cn } from "@/utils";
import type { ToasterProps } from "sonner";

const Toaster = ({
  className,
  position = "top-center",
  style,
  toastOptions,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const portalTarget =
    typeof document === "undefined" ? undefined : document.body;

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={position}
      className={cn("toaster group z-2147483647", className)}
      icons={{
        info: null,
        success: null,
        warning: null,
        error: null,
        loading: null,
      }}
      style={{ ...style, pointerEvents: "auto", zIndex: 2147483647 }}
      toastOptions={{
        ...toastOptions,
        style: {
          ...toastOptions?.style,
          pointerEvents: "auto",
        },
        classNames: {
          ...toastOptions?.classNames,
          toast: cn(
            "cn-toast flex! items-start! rounded-xl! border-none! px-3! py-2.5! text-[14px]! text-(--lc-text)/90!",
            toastOptions?.classNames?.toast,
          ),
          title: cn("font-medium!", toastOptions?.classNames?.title),
          description: "text-current/75!",
          icon: cn(
            "mr-0! flex! h-5! w-5! shrink-0! items-center! justify-center! opacity-100!",
            toastOptions?.classNames?.icon,
          ),
          content: cn("leading-[20px]!", toastOptions?.classNames?.content),
          info: "bg-(--lc-bg)/90!",
          success: "bg-(--lc-green)/90! text-white!",
          warning: "bg-(--lc-orange)/90! text-white!",
          error: "bg-(--lc-red)/90! text-white!",
          loading: "bg-(--lc-bg)/90!",
        },
      }}
      {...props}
    />,
    portalTarget,
  );
};

export { Toaster };

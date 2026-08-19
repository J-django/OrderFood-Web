import type { RouteSharedConfig } from "@/types";

export const routeSharedConfig = {
  hydrateFallbackElement: (
    <div className="grid min-h-dvh place-items-center bg-[#f8f8f8]">
      <span
        className="icon-[lucide--loader-circle] size-6 animate-spin text-[#ff5a36]"
        aria-label="页面加载中"
      />
    </div>
  ),
} satisfies RouteSharedConfig;

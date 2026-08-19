import { NavLink, Outlet } from "react-router";
import { bottomNavigation } from "@/constants";
import { cn } from "@/utils";

export function MobileLayout() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-white shadow-[0_0_40px_rgba(41,37,36,0.08)]">
      <main className="min-h-0 flex-1 pb-[calc(64px+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>

      <nav
        aria-label="主导航"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto grid h-[calc(64px+env(safe-area-inset-bottom))] w-full max-w-[480px] grid-cols-3 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      >
        {bottomNavigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 text-[11px] font-medium text-stone-400 transition-colors",
                isActive && "text-[#ff5a36]",
              )
            }
          >
            <span className={cn(item.icon, "size-5")} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

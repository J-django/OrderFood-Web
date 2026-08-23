import { useEffect, useRef, useState, type CSSProperties } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router";
import { getMe } from "@/api/endpoints/users";
import { bottomNavigation } from "@/constants";
import { useUserStore } from "@/store";
import { cn } from "@/utils";

const tabBarPaths = new Set<string>(
  bottomNavigation.map((item) => item.path),
);

export function MobileLayout() {
  const { pathname, search } = useLocation();
  const accessToken = useUserStore((state) => state.accessToken);
  const setUser = useUserStore((state) => state.setUser);
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const userRequestStarted = useRef(false);
  const mounted = useRef(false);
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!accessToken || userRequestStarted.current) return;
    userRequestStarted.current = true;

    getMe()
      .then((result) => {
        if (mounted.current) setUserInfo(result);
      })
      .catch(() => {
        if (mounted.current) setUser(null);
      })
      .finally(() => {
        if (mounted.current) setUserReady(true);
      });
  }, [accessToken, setUser, setUserInfo]);

  if (!accessToken) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(`${pathname}${search}`)}`}
        replace
      />
    );
  }

  if (!userReady) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[#f8f8f8]">
        <span
          className="icon-[lucide--loader-circle] size-6 animate-spin text-(--theme-color)"
          aria-label="页面加载中"
        />
      </div>
    );
  }

  const showTabBar = tabBarPaths.has(pathname);
  const layoutStyle = {
    "--layout-bottom-offset": showTabBar
      ? "calc(3.5rem + env(safe-area-inset-bottom))"
      : "0px",
  } as CSSProperties;

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-120 flex-col bg-white shadow-[0_0_2.5rem_rgba(41,37,36,0.08)]"
      style={layoutStyle}
    >
      <main
        className={cn(
          "min-h-0 flex-1",
          showTabBar && "pb-[calc(3.5rem+env(safe-area-inset-bottom))]",
        )}
      >
        <Outlet />
      </main>

      {showTabBar && (
        <nav
          aria-label="主导航"
          className="border-stone-150 fixed inset-x-0 bottom-0 z-40 mx-auto grid h-[calc(3.5rem+env(safe-area-inset-bottom))] w-full max-w-120 grid-cols-3 border-t bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
        >
        {bottomNavigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "text-3 flex min-w-0 flex-col items-center justify-center gap-1 font-medium text-stone-400 transition-colors",
                isActive && "text-[#ff5a36]",
              )
            }
          >
            <span className={cn(item.icon, "size-4.5")} aria-hidden="true" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
        </nav>
      )}
    </div>
  );
}

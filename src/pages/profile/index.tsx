import { useEffect, useState } from "react";
import { Link } from "react-router";
import { logout } from "@/api";
import { getMe } from "@/api/endpoints/users";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useFamilyStore, useUserStore } from "@/store";

const profileEntries = [
  {
    title: "我的家庭",
    path: "/profile/families",
    icon: "icon-[lucide--house-heart]",
  },
  {
    title: "我的订单",
    path: "/profile/orders",
    icon: "icon-[lucide--receipt-text]",
  },
  {
    title: "添加菜品",
    path: "/profile/dishes/new",
    icon: "icon-[lucide--utensils]",
  },
  {
    title: "菜品种类",
    path: "/profile/categories",
    icon: "icon-[lucide--tags]",
  },
] as const;

export default function ProfilePage() {
  useDocumentTitle("我的");
  const user = useUserStore((state) => state.user);
  const clearAuth = useUserStore((state) => state.clearAuth);
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const setCurrentFamily = useFamilyStore((state) => state.setCurrentFamily);
  const [orderedDishCount, setOrderedDishCount] = useState<number | null>(null);

  useEffect(() => {
    if (!currentFamilyId) return;
    let cancelled = false;
    getMe()
      .then((result) => {
        if (cancelled) return;
        setOrderedDishCount(result.orderedDishCount);
        if (!currentFamilyId && result.user.defaultFamilyId) {
          setCurrentFamily(result.user.defaultFamilyId);
        }
      })
      .catch(() => {
        /* 静默失败，不影响页面展示 */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFamilyId]);

  async function handleLogout() {
    const { refreshToken } = useUserStore.getState();
    try {
      await logout(refreshToken ? { refreshToken } : {});
    } catch {
      // Local auth must still be cleared when server-side revocation fails.
    } finally {
      clearAuth();
      setCurrentFamily(null);
      toast.add({ type: "success", title: "已退出登录" });
      window.location.assign("/login");
    }
  }

  return (
    <div className="min-h-[calc(100dvh-var(--layout-bottom-offset))] bg-[#f8f8f8] pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <section className="px-4 pb-5" aria-label="用户信息">
        <div className="flex items-center gap-3">
          <div className="grid size-16 place-items-center overflow-hidden rounded-full bg-(--theme-color-soft) text-(--theme-color)">
            <span className="icon-[lucide--user-round] size-7" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#222]">
              {user?.name || "用户"}
            </h1>
            <p className="mt-1 text-xs text-[#999]">
              {orderedDishCount === null
                ? "欢迎回来"
                : `已点过 ${orderedDishCount} 道菜`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="ml-auto h-8 rounded-full border border-stone-200 px-3.5 text-xs font-medium text-stone-500 active:bg-stone-100"
          >
            退出登录
          </button>
        </div>
      </section>
      <section
        className="mx-3 overflow-hidden rounded-xl bg-white"
        aria-label="我的功能"
      >
        {profileEntries.map((entry) => (
          <Link
            key={entry.path}
            to={entry.path}
            className="text-4 flex items-center justify-between border-b border-[#f0f0f0] px-3.5 py-2.5 text-[#222] last:border-b-0"
          >
            <span className="flex items-center gap-3">
              <span className={`${entry.icon} size-5 text-(--theme-color)`} />
              <span className="text-sm">{entry.title}</span>
            </span>
            <span className="icon-[lucide--chevron-right] size-5 text-[#999]" />
          </Link>
        ))}
      </section>
    </div>
  );
}

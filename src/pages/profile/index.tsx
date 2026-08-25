import { ActionButton } from "@/components";
import { Link, useNavigate } from "react-router";
import { logout } from "@/api";
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
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const orderedDishCount = useUserStore((state) => state.orderedDishCount);
  const clearAuth = useUserStore((state) => state.clearAuth);
  const setCurrentFamily = useFamilyStore((state) => state.setCurrentFamily);
  async function handleLogout() {
    const { refreshToken } = useUserStore.getState();
    try {
      await logout(refreshToken ? { refreshToken } : {});
    } catch {
      // Local auth must still be cleared when server-side revocation fails.
    } finally {
      clearAuth();
      setCurrentFamily(null);
      navigate("/login", { replace: true });
      toast.add({ type: "success", title: "已退出登录" });
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
          <ActionButton
            className="ml-auto w-auto px-3"
            variant="primary"
            onClick={handleLogout}
          >
            <span className="text-sm font-medium">退出登录</span>
          </ActionButton>
        </div>
      </section>
      <section
        className="mx-2.5 overflow-hidden rounded-2xl bg-white"
        aria-label="我的功能"
      >
        {profileEntries.map((entry) => (
          <Link
            key={entry.path}
            to={entry.path}
            className="text-4 relative flex items-center justify-between px-2.5 py-2 text-[#222] after:absolute after:right-3 after:bottom-0 after:left-3 after:h-px after:bg-[#f0f0f0] after:content-[''] last:after:hidden"
          >
            <span className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-(--theme-color-soft) text-(--theme-color)">
                <span
                  className={`${entry.icon} size-4.5 text-(--theme-color)`}
                />
              </span>
              <span className="text-sm">{entry.title}</span>
            </span>
            <span className="icon-[lucide--chevron-right] size-5 text-[#999]" />
          </Link>
        ))}
      </section>
    </div>
  );
}

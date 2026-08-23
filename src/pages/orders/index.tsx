import { useEffect, useState } from "react";
import { orderToFoodOrder } from "@/api/endpoints/adapters";
import { getOrders, repeatOrder } from "@/api/endpoints/orders";
import { FoodCard, Page } from "@/components";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useFamilyStore } from "@/store";
import { toast } from "@/components/ui/toast";
import type { FoodOrder } from "@/types";

const statusLabels: Record<string, string> = {
  pending_confirmation: "待确认",
};

function formatDate(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function OrdersPage() {
  useDocumentTitle("我的订单");
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loadedFamilyId, setLoadedFamilyId] = useState<string | null>(null);
  const [repeatingId, setRepeatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentFamilyId) return;
    let cancelled = false;
    getOrders()
      .then((result) => {
        if (!cancelled) setOrders((result.items ?? []).map(orderToFoodOrder));
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoadedFamilyId(currentFamilyId);
      });
    return () => {
      cancelled = true;
    };
  }, [currentFamilyId]);

  const loading =
    Boolean(currentFamilyId) && loadedFamilyId !== currentFamilyId;

  async function handleRepeat(orderId: string) {
    if (repeatingId) return;
    setRepeatingId(orderId);
    try {
      await repeatOrder(orderId);
      toast.add({ type: "success", title: "已重新下单" });
      const result = await getOrders();
      setOrders((result.items ?? []).map(orderToFoodOrder));
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setRepeatingId(null);
    }
  }

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header title="我的订单" backTo={routePaths.profile} />
      <Page.Content>
        {!currentFamilyId ? (
          <div className="grid min-h-[60dvh] place-items-center px-6 text-center">
            <div>
              <span className="icon-[lucide--receipt-text] mx-auto block size-8 text-[#b8b8b8]" />
              <p className="mt-3 text-sm text-[#999]">请先创建家庭</p>
            </div>
          </div>
        ) : loading ? (
          <div className="grid min-h-[60dvh] place-items-center px-6 text-sm text-[#999]">
            加载中…
          </div>
        ) : orders.length ? (
          <section className="space-y-2.5 p-2.5" aria-label="订单列表">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl bg-white p-2.5"
              >
                <header className="flex items-center justify-between gap-3 pb-2 text-xs">
                  <span className="truncate text-[#999]">
                    订单号 {order.orderNo}
                  </span>
                  <span className="shrink-0 text-[13px] font-semibold text-(--theme-color)">
                    {statusLabels[order.status] ?? "待确认"}
                  </span>
                </header>
                <div className="border-t border-[#f5f5f5]">
                  {order.items.slice(0, 3).map((item) => (
                    <FoodCard
                      key={item.id}
                      className="px-0"
                      item={item}
                      imageSize="sm"
                    />
                  ))}
                </div>
                <footer className="flex items-end justify-between">
                  <span className="text-[13px] text-[#999]">
                    {formatDate(order.createdAt)} · 共{order.items.length}道菜
                  </span>
                  <button
                    type="button"
                    disabled={repeatingId === order.id}
                    onClick={() => void handleRepeat(order.id)}
                    className="h-6 rounded-full bg-(--theme-color) px-2.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    再次下单
                  </button>
                </footer>
              </article>
            ))}
          </section>
        ) : (
          <div className="grid min-h-[60dvh] place-items-center px-6 text-center">
            <div>
              <span className="icon-[lucide--receipt-text] mx-auto block size-8 text-[#b8b8b8]" />
              <p className="mt-3 text-sm text-[#999]">暂无相关订单</p>
            </div>
          </div>
        )}
      </Page.Content>
    </Page>
  );
}

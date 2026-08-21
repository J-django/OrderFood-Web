import { useNavigate } from "react-router";
import { Page } from "@/components";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useCartStore, useOrderStore } from "@/store";

function formatDate(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function OrdersPage() {
  useDocumentTitle("我的订单");
  const navigate = useNavigate();
  const orders = useOrderStore((state) => state.orders);
  const setItems = useCartStore((state) => state.setItems);

  function rebuy(orderId: string) {
    const order = orders.find((entry) => entry.id === orderId);
    if (!order) return;
    setItems(order.items);
    navigate(routePaths.orderConfirm);
  }

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header title="我的订单" backTo={routePaths.profile} />
      <Page.Content>
        {orders.length ? <section className="space-y-2.5 p-2.5" aria-label="订单列表">
          {orders.map((order) => <article key={order.id} className="overflow-hidden rounded-2xl bg-white p-3">
            <header className="flex items-center justify-between gap-3 pb-2 text-xs"><span className="truncate text-[#999]">订单号 {order.orderNo}</span><span className="shrink-0 text-[#ff5f15]">待确认</span></header>
            <div className="space-y-2.5 border-t border-[#f5f5f5] pt-3">
              {order.items.slice(0, 3).map((item) => <div key={item.id} className="flex items-center"><img src={item.image} alt="" className="size-12 rounded-lg object-cover" /><span className="ml-2.5 flex-1 truncate text-sm text-[#333]">{item.name}</span></div>)}
            </div>
            <footer className="mt-3 flex items-center justify-between border-t border-[#f5f5f5] pt-2.5"><span className="text-xs text-[#999]">{formatDate(order.createdAt)} · 共{order.items.length}道菜</span><button type="button" onClick={() => rebuy(order.id)} className="h-7 rounded-full bg-[#ff5f15] px-3 text-xs text-white">再次下单</button></footer>
          </article>)}
        </section> : <div className="grid min-h-[60dvh] place-items-center px-6 text-center"><div><span className="icon-[lucide--receipt-text] mx-auto block size-8 text-[#b8b8b8]" /><p className="mt-3 text-sm text-[#999]">暂无相关订单</p></div></div>}
      </Page.Content>
    </Page>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router";
import { Page } from "@/components";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useCartStore, useOrderStore } from "@/store";

export default function OrderConfirmPage() {
  useDocumentTitle("订单确认");
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const createOrder = useOrderStore((state) => state.createOrder);
  const [expanded, setExpanded] = useState(false);
  const [remark, setRemark] = useState("");
  const visibleItems = expanded ? items : items.slice(0, 5);

  function submitOrder() {
    if (!items.length) return;
    createOrder(items, remark.trim());
    clear();
    navigate(routePaths.orders, { replace: true });
  }

  return (
    <Page className="bg-[#f6f6f6]">
      <Page.Header title="订单确认" backTo={routePaths.home} />
      <Page.Content className="p-2.5 pb-22">
        {items.length ? (
          <section className="overflow-hidden rounded-xl bg-white">
            <div className="py-3">
              {visibleItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-start px-3 ${index < visibleItems.length - 1 ? "pb-2.5" : ""}`}
                >
                  <img
                    src={item.image}
                    alt=""
                    className="size-12 shrink-0 rounded object-cover"
                  />
                  <h2 className="ml-2.5 min-w-0 flex-1 text-sm leading-5 text-[#333]">
                    {item.name}
                  </h2>
                </div>
              ))}
              {items.length > 5 && (
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="text-3 flex h-9 w-full items-center justify-center gap-1 text-[#666]"
                >
                  {expanded ? "收起" : "展开"}
                  <span
                    className={`icon-[lucide--chevron-down] size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>
            <div className="px-3 pb-2.5">
              <label className="text-3 block text-[#666]">备注</label>
              <textarea
                value={remark}
                onChange={(event) => setRemark(event.target.value)}
                maxLength={50}
                rows={3}
                placeholder="请输入备注信息"
                className="text-3 mt-1.5 block w-full resize-none rounded-md bg-[#f8f8f8] px-3 py-2.5 leading-5 text-[#333] outline-none placeholder:text-[#aeb3b7]"
              />
            </div>
            <div className="mx-4 flex h-9 items-center border-t border-[#f5f5f5] text-xs text-[#999]">
              共{items.length}道菜
            </div>
          </section>
        ) : (
          <div className="pt-32 text-center text-sm text-[#999]">
            暂无待确认菜品
          </div>
        )}
      </Page.Content>
      <footer className="absolute inset-x-0 bottom-0 flex h-[calc(3.5rem+env(safe-area-inset-bottom))] items-start justify-end bg-white px-4 pt-3">
        <button
          type="button"
          disabled={!items.length}
          onClick={submitOrder}
          className="h-10 w-30 rounded-full bg-[#fa4126] text-sm font-bold text-white disabled:opacity-40"
        >
          提交订单
        </button>
      </footer>
    </Page>
  );
}

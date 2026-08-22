import { useState } from "react";
import { useNavigate } from "react-router";
import { createOrder } from "@/api/endpoints/orders";
import { FoodCard, Page } from "@/components";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useCartStore, useFamilyStore } from "@/store";

export default function OrderConfirmPage() {
  useDocumentTitle("订单确认");
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const [expanded, setExpanded] = useState(false);
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 5);

  async function submitOrder() {
    if (!items.length || submitting) return;
    if (!currentFamilyId) return;
    setSubmitting(true);
    try {
      await createOrder({
        dishIds: items.map((item) => item.id),
        note: remark.trim() || undefined,
      });
      clear();
      navigate(routePaths.orders, { replace: true });
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Page className="bg-[#f6f6f6]">
      <Page.Header title="订单确认" backTo={routePaths.home} />
      <Page.Content className="p-2.5 pb-22">
        {items.length ? (
          <section className="overflow-hidden rounded-xl bg-white">
            {visibleItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                imageSize="sm"
                className="border-b-0"
              />
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
            <div className="px-3 pb-2.5">
              <label className="block text-[13px] text-[#666]">备注</label>
              <textarea
                value={remark}
                onChange={(event) => setRemark(event.target.value)}
                maxLength={50}
                rows={3}
                placeholder="请输入备注信息"
                className="mt-1.5 block w-full resize-none rounded-md bg-[#f8f8f8] px-3 py-2.5 text-[13px] leading-5 text-[#333] outline-none placeholder:text-[#aeb3b7]"
              />
            </div>
            <div className="mx-4 flex h-9 items-center border-t border-[#f5f5f5] text-[13px] text-[#999]">
              共{items.length}道菜
            </div>
          </section>
        ) : (
          <div className="pt-32 text-center text-sm text-[#999]">
            暂无待确认菜品
          </div>
        )}
      </Page.Content>
      <footer className="absolute inset-x-0 bottom-0 flex justify-end bg-white px-2.5 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        <button
          type="button"
          disabled={!items.length || !currentFamilyId || submitting}
          onClick={() => void submitOrder()}
          className="h-10 w-30 rounded-full bg-[#fa4126] text-sm font-bold text-white disabled:opacity-40"
        >
          {submitting ? "提交中…" : "提交订单"}
        </button>
      </footer>
    </Page>
  );
}

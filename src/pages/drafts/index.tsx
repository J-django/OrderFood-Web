import { useState } from "react";
import { useNavigate } from "react-router";
import { Page } from "@/components";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useCartStore, useDraftStore } from "@/store";

function formatTime(value: string) {
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function DraftsPage() {
  useDocumentTitle("草稿");
  const navigate = useNavigate();
  const drafts = useDraftStore((state) => state.drafts);
  const removeDraft = useDraftStore((state) => state.removeDraft);
  const setItems = useCartStore((state) => state.setItems);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function editDraft(id: string) {
    const draft = drafts.find((entry) => entry.id === id);
    if (!draft || !draft.items?.length) return;
    setItems(draft.items);
    localStorage.setItem("order-food-editing-draft", id);
    navigate(routePaths.home);
  }

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Content>
        {drafts.length ? (
          <section className="space-y-2.5 p-2.5" aria-label="草稿列表">
            {drafts.map((draft) => (
              <article
                key={draft.id}
                className="overflow-hidden rounded-2xl bg-white"
              >
                <header className="flex items-center justify-between border-b border-[#eee] px-3 py-2 text-sm text-[#555]">
                  <span>草稿 {formatTime(draft.updatedAt)}</span>
                  <span className="flex gap-4 font-medium text-[#ff5f15]">
                    <button type="button" onClick={() => editDraft(draft.id)}>
                      编辑
                    </button>
                    <button
                      className="font-medium"
                      type="button"
                      onClick={() => setDeletingId(draft.id)}
                    >
                      删除
                    </button>
                  </span>
                </header>
                <div className="py-2.5">
                  {(draft.items ?? []).map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-start px-3 ${index < draft.items.length - 1 ? "pb-2.5" : ""}`}
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="size-15 shrink-0 rounded-md object-cover"
                      />
                      <div className="ml-2 min-w-0 flex-1">
                        <h2 className="text-sm leading-5 font-semibold text-[#222]">
                          {item.name}
                        </h2>
                        <p className="truncate text-[13px] leading-4.5 text-[#777]">
                          <b className="text-[#555]">食材：</b>
                          {item.ingredients || "暂无"}
                        </p>
                        <p className="truncate text-[13px] leading-4.5 text-[#777]">
                          <b className="text-[#555]">配料：</b>
                          {item.seasonings || "暂无"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="pt-32 text-center text-sm text-[#999]">
            暂无草稿订单
          </div>
        )}
      </Page.Content>
      {deletingId && (
        <div
          className="absolute inset-0 z-50 grid place-items-center bg-black/40 px-8"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-80 rounded-2xl bg-white p-5 text-center">
            <h2 className="text-base font-semibold text-[#222]">删除草稿</h2>
            <p className="mt-2 text-sm text-[#777]">确认删除此草稿吗？</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="h-10 rounded-full bg-[#f4f4f4] text-sm"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  removeDraft(deletingId);
                  setDeletingId(null);
                }}
                className="h-10 rounded-full bg-[#ff5f15] text-sm text-white"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}

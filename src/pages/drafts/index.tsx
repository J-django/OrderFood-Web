import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteDraft, getDrafts } from "@/api/endpoints/drafts";
import { draftToMenuDraft } from "@/api/endpoints/adapters";
import { FoodCard, Page } from "@/components";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useCartStore, useFamilyStore } from "@/store";

function formatTime(value: string) {
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function DraftsPage() {
  useDocumentTitle("草稿");
  const navigate = useNavigate();
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const setItems = useCartStore((state) => state.setItems);
  const [drafts, setDrafts] = useState<ReturnType<typeof draftToMenuDraft>[]>(
    [],
  );
  const [loadedFamilyId, setLoadedFamilyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!currentFamilyId) return;
    let cancelled = false;
    getDrafts()
      .then((result) => {
        if (!cancelled) {
          setDrafts((result.items ?? []).map(draftToMenuDraft));
        }
      })
      .catch(() => {
        if (!cancelled) setDrafts([]);
      })
      .finally(() => {
        if (!cancelled) setLoadedFamilyId(currentFamilyId);
      });
    return () => {
      cancelled = true;
    };
  }, [currentFamilyId]);

  const loading = Boolean(currentFamilyId) && loadedFamilyId !== currentFamilyId;

  async function handleDelete() {
    if (!deletingId || deleting) return;
    setDeleting(true);
    try {
      await deleteDraft(deletingId);
      setDrafts((prev) => prev.filter((draft) => draft.id !== deletingId));
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  }

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
        {!currentFamilyId ? (
          <div className="pt-32 text-center text-sm text-[#999]">
            请先选择家庭
          </div>
        ) : loading ? (
          <div className="pt-32 text-center text-sm text-[#999]">加载中…</div>
        ) : drafts.length ? (
          <section className="space-y-2.5 p-2.5" aria-label="草稿列表">
            {drafts.map((draft) => (
              <article
                key={draft.id}
                className="overflow-hidden rounded-xl bg-white"
              >
                <header className="flex items-center justify-between border-b border-[#f0f0f0] px-3 py-2 text-sm text-[#555]">
                  <span>
                    草稿{draft.name ? `「${draft.name}」` : " "}
                    {formatTime(draft.updatedAt)}
                  </span>
                  <span className="flex gap-4 font-medium text-(--theme-color)">
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
                {(draft.items ?? []).map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    imageSize="md"
                    truncateDetail
                    emptyDetailText="暂无"
                  />
                ))}
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
                onClick={() => void handleDelete()}
                className="h-10 rounded-full bg-(--theme-color) text-sm text-white"
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

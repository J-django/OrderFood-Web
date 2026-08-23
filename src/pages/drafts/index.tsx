import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import { deleteDraft, getDrafts } from "@/api/endpoints/drafts";
import {
  createMemo,
  deleteMemo,
  getMemos,
  updateMemo,
} from "@/api/endpoints/memos";
import { draftToMenuDraft } from "@/api/endpoints/adapters";
import { Dialog, FoodCard, Page } from "@/components";
import { Segmented } from "@/components/segmented";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useCartStore, useFamilyStore, useUserStore } from "@/store";
import type { ApiMemo } from "@/types";

function formatTime(value: string) {
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function DraftsPage() {
  useDocumentTitle("草稿");
  const navigate = useNavigate();
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const user = useUserStore((state) => state.user);
  const setItems = useCartStore((state) => state.setItems);
  const [drafts, setDrafts] = useState<ReturnType<typeof draftToMenuDraft>[]>(
    [],
  );
  const [memos, setMemos] = useState<ApiMemo[]>([]);
  const [activeTab, setActiveTab] = useState("memos");
  const [loadedFamilyId, setLoadedFamilyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [memoEditor, setMemoEditor] = useState<ApiMemo | "new" | null>(null);
  const [memoName, setMemoName] = useState("");
  const [memoContent, setMemoContent] = useState("");
  const [memoSubmitting, setMemoSubmitting] = useState(false);
  const [deletingMemoId, setDeletingMemoId] = useState<string | null>(null);
  const [deletingMemo, setDeletingMemo] = useState(false);

  useEffect(() => {
    if (!currentFamilyId) return;
    let cancelled = false;
    Promise.all([getDrafts(), getMemos()])
      .then(([draftResult, memoResult]) => {
        if (cancelled) return;
        setDrafts((draftResult.items ?? []).map(draftToMenuDraft));
        setMemos(memoResult.items ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setDrafts([]);
        setMemos([]);
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

  function openMemoEditor(memo?: ApiMemo) {
    setMemoEditor(memo ?? "new");
    setMemoName(memo?.name ?? "");
    setMemoContent(memo?.content ?? "");
  }

  function closeMemoEditor() {
    setMemoEditor(null);
    setMemoName("");
    setMemoContent("");
  }

  async function handleSaveMemo() {
    const name = memoName.trim();
    const content = memoContent.trim();
    if (!name || !content || !memoEditor || memoSubmitting) {
      if (!name || !content) {
        toast.add({ type: "error", title: "请输入备忘录标题和内容" });
      }
      return;
    }
    setMemoSubmitting(true);
    try {
      if (memoEditor === "new") {
        const memo = await createMemo({ name, content });
        setMemos((current) => [memo, ...current]);
        toast.add({ type: "success", title: "备忘录已添加" });
      } else {
        const memo = await updateMemo(memoEditor.id, { name, content });
        setMemos((current) =>
          current.map((item) => (item.id === memo.id ? memo : item)),
        );
        toast.add({ type: "success", title: "备忘录已保存" });
      }
      closeMemoEditor();
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setMemoSubmitting(false);
    }
  }

  async function handleDeleteMemo() {
    if (!deletingMemoId || deletingMemo) return;
    setDeletingMemo(true);
    try {
      await deleteMemo(deletingMemoId);
      setMemos((current) =>
        current.filter((memo) => memo.id !== deletingMemoId),
      );
      toast.add({ type: "success", title: "备忘录已删除" });
      setDeletingMemoId(null);
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setDeletingMemo(false);
    }
  }

  const editingMemoId =
    memoEditor && memoEditor !== "new" ? memoEditor.id : null;

  function renderMemoEditor(memo?: ApiMemo) {
    return (
      <article className="rounded-xl bg-white px-3 py-3">
        <div className="flex items-center gap-2">
          <Input
            value={memoName}
            onChange={(event) => setMemoName(event.target.value)}
            placeholder="标题"
            aria-label="备忘录标题"
            maxLength={120}
            className="h-9 min-w-0 flex-1 rounded-lg border-none bg-[#f8f8f8] px-3 text-sm outline-none"
          />
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="取消编辑备忘录"
              onClick={closeMemoEditor}
              disabled={memoSubmitting}
              className="grid size-9 place-items-center rounded-full bg-stone-100 text-stone-700 transition-colors active:bg-stone-200 disabled:opacity-50"
            >
              <span className="icon-[lucide--x] size-4.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="保存备忘录"
              onClick={() => void handleSaveMemo()}
              disabled={memoSubmitting}
              className="grid size-9 place-items-center rounded-full bg-(--theme-color)/10 text-(--theme-color) transition-colors active:opacity-80 disabled:opacity-50"
            >
              <span
                className="icon-[lucide--check] size-4.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <Textarea
          value={memoContent}
          onChange={(event) => setMemoContent(event.target.value)}
          placeholder="内容"
          aria-label="备忘录内容"
          maxLength={10000}
          rows={6}
          className="mt-2 min-h-28 resize-none rounded-lg border-none bg-[#f8f8f8] px-3 py-2.5 text-sm outline-none"
        />
        {memo ? (
          <time className="mt-2 block text-xs text-[#999]">
            {formatTime(memo.updatedAt)}
          </time>
        ) : null}
      </article>
    );
  }

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header
        showBack={false}
        trailing={
          activeTab === "memos" && memoEditor === null ? (
            <button
              type="button"
              aria-label="添加备忘录"
              onClick={() => openMemoEditor()}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-(--theme-color)/10 text-(--theme-color) transition-colors hover:opacity-90 active:opacity-80"
            >
              <span className="icon-[lucide--plus] size-5" aria-hidden="true" />
            </button>
          ) : null
        }
        title={
          <Segmented
            value={activeTab}
            onValueChange={setActiveTab}
            aria-label="内容类型"
          >
            <Segmented.Item value="memos">备忘录</Segmented.Item>
            <Segmented.Item value="drafts">草稿</Segmented.Item>
          </Segmented>
        }
      />
      <Page.Content>
        {!currentFamilyId ? (
          <div className="pt-32 text-center text-sm text-[#999]">
            请先创建家庭
          </div>
        ) : loading ? (
          <div className="pt-32 text-center text-sm text-[#999]">加载中…</div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, pointerEvents: "auto" }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="min-h-full"
            >
              {activeTab === "drafts" ? (
                drafts.length ? (
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
                            <button
                              type="button"
                              onClick={() => editDraft(draft.id)}
                            >
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
                )
              ) : (
                <section className="space-y-2.5 p-2.5" aria-label="备忘录列表">
                  {memoEditor === "new" ? renderMemoEditor() : null}
                  {memos.map((memo) =>
                    editingMemoId === memo.id ? (
                      <div key={memo.id}>{renderMemoEditor(memo)}</div>
                    ) : (
                      <article
                        key={memo.id}
                        className="rounded-xl bg-white px-3 py-3"
                      >
                        <header className="flex items-center justify-between gap-3">
                          <h2 className="min-w-0 truncate text-sm font-semibold text-[#333]">
                            {memo.name}
                          </h2>
                          <div className="flex shrink-0 items-center gap-3">
                            <button
                              type="button"
                              aria-label={`编辑${memo.name}`}
                              onClick={() => openMemoEditor(memo)}
                              className="text-xs font-medium text-(--theme-color)"
                            >
                              编辑
                            </button>
                            {memo.userId === user?.id && (
                              <button
                                type="button"
                                aria-label={`删除${memo.name}`}
                                onClick={() => setDeletingMemoId(memo.id)}
                                className="text-xs font-medium text-(--theme-color)"
                              >
                                删除
                              </button>
                            )}
                            <time className="text-xs text-[#999]">
                              {formatTime(memo.updatedAt)}
                            </time>
                          </div>
                        </header>
                        <p className="mt-2 truncate text-sm leading-5 whitespace-pre-wrap text-[#666]">
                          {memo.content}
                        </p>
                      </article>
                    ),
                  )}
                  {!memos.length && memoEditor !== "new" ? (
                    <div className="pt-32 text-center text-sm text-[#999]">
                      暂无备忘录
                    </div>
                  ) : null}
                </section>
              )}
            </motion.div>
          </AnimatePresence>
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
      <Dialog
        open={Boolean(deletingMemoId)}
        title="删除备忘录"
        content="确认删除此备忘录吗？"
        showCancel
        confirmText={deletingMemo ? "删除中…" : "删除"}
        maskClosable={false}
        classes={{ confirmButton: "bg-(--theme-color) text-white" }}
        onConfirm={() => void handleDeleteMemo()}
        onCancel={() => setDeletingMemoId(null)}
        onClose={() => setDeletingMemoId(null)}
      />
    </Page>
  );
}

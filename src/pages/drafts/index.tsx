import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { deleteDraft, getDrafts } from "@/api/endpoints/drafts";
import {
  createMemo,
  deleteMemo,
  getMemos,
  updateMemo,
} from "@/api/endpoints/memos";
import { draftToMenuDraft } from "@/api/endpoints/adapters";
import {
  ActionButton,
  ConditionalPresence,
  Dialog,
  FamilyRequired,
  FoodCard,
  Page,
  PresenceFade,
} from "@/components";
import { Segmented } from "@/components/segmented";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useCartStore, useFamilyStore, useUserStore } from "@/store";
import type { ApiMemo } from "@/types";

function formatDate(value: string) {
  return format(new Date(value), "yyyy-MM-dd");
}

type MemoEditorValues = {
  name: string;
  content: string;
};

type MemoEditorProps = MemoEditorValues & {
  submitting: boolean;
  onNameChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

type EditMemoProps = MemoEditorProps & {
  updatedAt: string;
};

function AddMemo({
  name,
  content,
  submitting,
  onNameChange,
  onContentChange,
  onCancel,
  onSave,
}: MemoEditorProps) {
  return (
    <article className="rounded-2xl bg-white pb-2.5">
      <header className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="标题"
          aria-label="备忘录标题"
          maxLength={120}
          className="text-md h-9 min-w-0 flex-1 rounded-lg border-none px-3 py-0 font-semibold text-[#333] outline-none"
        />
        <div className="flex -translate-x-1 translate-y-1 items-center gap-1">
          <ActionButton
            type="button"
            variant="info"
            aria-label="取消添加备忘录"
            onClick={onCancel}
            disabled={submitting}
          >
            <span className="icon-[lucide--x] size-4.5" aria-hidden="true" />
          </ActionButton>
          <ActionButton
            type="button"
            variant="primary"
            aria-label="保存备忘录"
            onClick={onSave}
            disabled={submitting}
          >
            <span
              className="icon-[lucide--check] size-4.5"
              aria-hidden="true"
            />
          </ActionButton>
        </div>
      </header>
      <Textarea
        value={content}
        onChange={(event) => onContentChange(event.target.value)}
        placeholder="内容"
        aria-label="备忘录内容"
        maxLength={10000}
        rows={6}
        className="min-h-28 resize-none rounded-lg border-none px-3 pt-0 pb-2.5 text-sm outline-none"
      />
    </article>
  );
}

function EditMemo({
  name,
  content,
  updatedAt,
  submitting,
  onNameChange,
  onContentChange,
  onCancel,
  onSave,
}: EditMemoProps) {
  return (
    <article
      data-time={formatDate(updatedAt)}
      className="relative isolate z-10 rounded-2xl bg-white before:pointer-events-none before:absolute before:-top-2 before:left-1/2 before:h-4 before:w-min before:-translate-x-1/2 before:rounded-[6px] before:bg-white before:px-1.5 before:text-center before:text-[13px] before:leading-4 before:whitespace-nowrap before:text-[#999] before:shadow-xs before:content-[attr(data-time)]"
    >
      <header className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="标题"
          aria-label="备忘录标题"
          maxLength={120}
          className="text-md h-9 min-w-0 flex-1 rounded-lg border-none px-3 py-0 font-semibold text-[#333] outline-none"
        />
        <div className="flex -translate-x-1 translate-y-1 items-center gap-1">
          <ActionButton
            type="button"
            variant="info"
            aria-label="取消编辑备忘录"
            onClick={onCancel}
            disabled={submitting}
          >
            <span className="icon-[lucide--x] size-4.5" aria-hidden="true" />
          </ActionButton>
          <ActionButton
            type="button"
            variant="primary"
            aria-label="保存备忘录"
            onClick={onSave}
            disabled={submitting}
          >
            <span
              className="icon-[lucide--check] size-4.5"
              aria-hidden="true"
            />
          </ActionButton>
        </div>
      </header>
      <Textarea
        value={content}
        onChange={(event) => onContentChange(event.target.value)}
        placeholder="内容"
        aria-label="备忘录内容"
        maxLength={10000}
        rows={6}
        className="min-h-28 resize-none rounded-lg border-none px-3 pt-0 pb-2.5 text-sm outline-none"
      />
    </article>
  );
}

type MemoInfoCardProps = {
  memo: ApiMemo;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function MemoInfo({ memo, canDelete, onEdit, onDelete }: MemoInfoCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      data-time={formatDate(memo.updatedAt)}
      onClick={onEdit}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onEdit();
        }
      }}
      className="relative isolate z-10 cursor-pointer rounded-2xl bg-white px-3 pb-2.5 before:pointer-events-none before:absolute before:-top-2 before:left-1/2 before:h-4 before:w-min before:-translate-x-1/2 before:rounded-[6px] before:bg-white before:px-1.5 before:text-center before:text-[13px] before:leading-4 before:whitespace-nowrap before:text-[#999] before:shadow-xs before:content-[attr(data-time)]"
    >
      <header className="flex h-9 items-center justify-between gap-3">
        <h2 className="text-md min-w-0 truncate font-semibold text-[#333]">
          {memo.name}
        </h2>
        <div className="flex shrink-0 items-center gap-3">
          {canDelete && (
            <ActionButton
              type="button"
              variant="danger"
              aria-label={`删除${memo.name}`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="translate-x-2 translate-y-1"
            >
              <span className="icon-[tabler--x] size-4" aria-hidden="true" />
            </ActionButton>
          )}
        </div>
      </header>
      <p className="truncate text-sm leading-5 whitespace-pre-wrap">
        {memo.content}
      </p>
    </article>
  );
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
  const [newMemo, setNewMemo] = useState<MemoEditorValues | null>(null);
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editingMemoName, setEditingMemoName] = useState("");
  const [editingMemoContent, setEditingMemoContent] = useState("");
  const [creatingMemo, setCreatingMemo] = useState(false);
  const [updatingMemo, setUpdatingMemo] = useState(false);
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

  function openNewMemo() {
    setNewMemo({
      name: "",
      content: "",
    });
  }

  function closeNewMemo() {
    setNewMemo(null);
  }

  function openMemoEditor(memo: ApiMemo) {
    setEditingMemoId(memo.id);
    setEditingMemoName(memo.name);
    setEditingMemoContent(memo.content);
  }

  function closeMemoEditor() {
    setEditingMemoId(null);
    setEditingMemoName("");
    setEditingMemoContent("");
  }

  async function handleCreateMemo() {
    if (!newMemo || creatingMemo) return;
    const name = newMemo.name.trim();
    const content = newMemo.content.trim();
    if (!name || !content) {
      if (!name || !content) {
        toast.add({ type: "error", title: "请输入备忘录标题和内容" });
      }
      return;
    }
    setCreatingMemo(true);
    try {
      const memo = await createMemo({ name, content });
      setMemos((current) => [memo, ...current]);
      toast.add({ type: "success", title: "备忘录已添加" });
      closeNewMemo();
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setCreatingMemo(false);
    }
  }

  async function handleUpdateMemo() {
    const name = editingMemoName.trim();
    const content = editingMemoContent.trim();
    if (!name || !content || !editingMemoId || updatingMemo) {
      if (!name || !content) {
        toast.add({ type: "error", title: "请输入备忘录标题和内容" });
      }
      return;
    }
    setUpdatingMemo(true);
    try {
      const memo = await updateMemo(editingMemoId, { name, content });
      setMemos((current) =>
        current.map((item) => (item.id === memo.id ? memo : item)),
      );
      toast.add({ type: "success", title: "备忘录已保存" });
      closeMemoEditor();
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setUpdatingMemo(false);
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

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header
        showBack={false}
        trailing={
          <ConditionalPresence
            show={
              activeTab === "memos" &&
              Boolean(currentFamilyId) &&
              newMemo === null
            }
          >
            <ActionButton
              type="button"
              aria-label="添加备忘录"
              onClick={openNewMemo}
            >
              <span className="icon-[tabler--plus] size-5" aria-hidden="true" />
            </ActionButton>
          </ConditionalPresence>
        }
        title={
          <Segmented
            value={activeTab}
            onValueChange={setActiveTab}
            aria-label="内容类型"
          >
            <Segmented.Item className="h-8 px-3.5" value="memos">
              备忘录
            </Segmented.Item>
            <Segmented.Item className="h-8 px-3.5" value="drafts">
              草稿
            </Segmented.Item>
          </Segmented>
        }
      />
      <Page.Content>
        {!currentFamilyId ? (
          <FamilyRequired className="min-h-full" />
        ) : loading ? (
          <div className="pt-32 text-center text-sm text-[#999]">加载中…</div>
        ) : (
          <PresenceFade stateKey={activeTab} className="min-h-full">
            {activeTab === "drafts" ? (
              drafts.length ? (
                <section
                  className="space-y-4 px-2.5 pt-3.5 pb-2.5"
                  aria-label="草稿列表"
                >
                  {drafts.map((draft) => (
                    <article
                      key={draft.id}
                      data-time={formatDate(draft.updatedAt)}
                      className="relative isolate z-10 rounded-2xl bg-white px-3 before:pointer-events-none before:absolute before:-top-2 before:left-1/2 before:h-4 before:w-min before:-translate-x-1/2 before:rounded-[6px] before:bg-white before:px-1.5 before:text-center before:text-[13px] before:leading-4 before:whitespace-nowrap before:text-[#999] before:shadow-xs before:content-[attr(data-time)]"
                    >
                      <header className="flex h-9 items-center justify-between gap-3">
                        <h2 className="min-w-0 truncate text-sm font-semibold text-[#333]">
                          草稿{draft.name ? `「${draft.name}」` : ""}
                        </h2>
                        <div className="flex translate-x-2 translate-y-1 items-center gap-1">
                          <ActionButton
                            type="button"
                            variant="danger"
                            aria-label="删除草稿"
                            onClick={() => setDeletingId(draft.id)}
                          >
                            <span
                              className="icon-[tabler--x] size-4"
                              aria-hidden="true"
                            />
                          </ActionButton>
                          <ActionButton
                            className="flex w-auto items-center gap-1.5 px-3"
                            type="button"
                            variant="primary"
                            aria-label="编辑草稿"
                            onClick={() => editDraft(draft.id)}
                          >
                            <span
                              className="icon-[tabler--pencil] size-4.5"
                              aria-hidden="true"
                            />

                            <span className="text-sm font-medium">编辑</span>
                          </ActionButton>
                        </div>
                      </header>
                      {(draft.items ?? []).map((item) => (
                        <FoodCard
                          className="px-0 first-of-type:pt-0"
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
              <section
                className="space-y-4 px-2.5 pt-3.5 pb-2.5"
                aria-label="备忘录列表"
              >
                {newMemo ? (
                  <AddMemo
                    name={newMemo.name}
                    content={newMemo.content}
                    submitting={creatingMemo}
                    onNameChange={(name) =>
                      setNewMemo((current) =>
                        current ? { ...current, name } : current,
                      )
                    }
                    onContentChange={(content) =>
                      setNewMemo((current) =>
                        current ? { ...current, content } : current,
                      )
                    }
                    onCancel={closeNewMemo}
                    onSave={() => void handleCreateMemo()}
                  />
                ) : null}
                {memos.map((memo) => {
                  const isEditing = editingMemoId === memo.id;
                  return isEditing ? (
                    <EditMemo
                      key={memo.id}
                      name={editingMemoName}
                      content={editingMemoContent}
                      updatedAt={memo.updatedAt}
                      submitting={updatingMemo}
                      onNameChange={setEditingMemoName}
                      onContentChange={setEditingMemoContent}
                      onCancel={closeMemoEditor}
                      onSave={() => void handleUpdateMemo()}
                    />
                  ) : (
                    <MemoInfo
                      key={memo.id}
                      memo={memo}
                      canDelete={memo.userId === user?.id}
                      onEdit={() => openMemoEditor(memo)}
                      onDelete={() => setDeletingMemoId(memo.id)}
                    />
                  );
                })}
                {!memos.length && !newMemo ? (
                  <div className="pt-32 text-center text-sm text-[#999]">
                    暂无备忘录
                  </div>
                ) : null}
              </section>
            )}
          </PresenceFade>
        )}
      </Page.Content>

      <Dialog
        open={Boolean(deletingId)}
        title="删除草稿"
        content="确认删除此草稿吗？"
        showCancel
        confirmText={deleting ? "删除中…" : "删除"}
        maskClosable={false}
        classes={{ confirmButton: "bg-(--lc-red)/10 text-(--lc-red)" }}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeletingId(null)}
        onClose={() => setDeletingId(null)}
      />

      <Dialog
        open={Boolean(deletingMemoId)}
        title="删除备忘录"
        content="确认删除此备忘录吗？"
        showCancel
        confirmText={deletingMemo ? "删除中…" : "删除"}
        maskClosable={false}
        classes={{ confirmButton: "bg-(--lc-red)/10 text-(--lc-red)" }}
        onConfirm={() => void handleDeleteMemo()}
        onCancel={() => setDeletingMemoId(null)}
        onClose={() => setDeletingMemoId(null)}
      />
    </Page>
  );
}

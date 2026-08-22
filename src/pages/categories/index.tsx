import { useEffect, useState } from "react";
import {
  createMenuCategory,
  deleteMenuCategory,
  getMenuCategories,
  updateMenuCategory,
} from "@/api/endpoints/menu";
import { Dialog, Page } from "@/components";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useFamilyStore } from "@/store";
import type { ApiMenuCategory } from "@/types";

export default function CategoriesPage() {
  useDocumentTitle("菜品种类");
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const [categories, setCategories] = useState<ApiMenuCategory[]>([]);
  const [loadedFamilyId, setLoadedFamilyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<ApiMenuCategory | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleting, setDeleting] = useState<ApiMenuCategory | null>(null);

  useEffect(() => {
    if (!currentFamilyId) return;
    let cancelled = false;
    getMenuCategories()
      .then((result) => {
        if (!cancelled) setCategories(result.items);
      })
      .catch(() => {
        if (!cancelled) toast.add({ type: "error", title: "菜品种类加载失败" });
      })
    .finally(() => {
        if (!cancelled) setLoadedFamilyId(currentFamilyId);
      });
    return () => {
      cancelled = true;
    };
  }, [currentFamilyId]);

  const loading = Boolean(currentFamilyId) && loadedFamilyId !== currentFamilyId;

  function openAdd() {
    setEditing(null);
    setName("");
    setEditorOpen(true);
  }

  function openEdit(category: ApiMenuCategory) {
    setEditing(category);
    setName(category.name);
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditing(null);
    setName("");
    setEditorOpen(false);
  }

  async function saveCategory() {
    const trimmedName = name.trim();
    if (!trimmedName || saving) return;
    setSaving(true);
    try {
      const result = editing
        ? await updateMenuCategory(editing.id, { name: trimmedName })
        : await createMenuCategory({ name: trimmedName });
      setCategories((items) =>
        editing
          ? items.map((item) => (item.id === result.id ? result : item))
          : [...items, result],
      );
      closeEditor();
      toast.add({ type: "success", title: editing ? "种类已更新" : "种类已添加" });
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting || saving) return;
    setSaving(true);
    try {
      await deleteMenuCategory(deleting.id);
      setCategories((items) => items.filter((item) => item.id !== deleting.id));
      setDeleting(null);
      toast.add({ type: "success", title: "种类已删除" });
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header
        title="菜品种类"
        backTo={routePaths.profile}
        trailing={
          <button
            type="button"
            aria-label="添加菜品种类"
            onClick={openAdd}
            className="grid size-10 place-items-center rounded-full text-stone-700 active:bg-stone-100"
          >
            <span className="icon-[lucide--plus] size-6" />
          </button>
        }
      />
      <Page.Content>
        {!currentFamilyId ? (
          <div className="px-6 py-16 text-center text-sm text-[#999]">
            请先选择或创建家庭
          </div>
        ) : loading ? (
          <div className="px-6 py-16 text-center text-sm text-[#999]">加载中…</div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#999]">
            还没有菜品种类，点击右上角添加
          </div>
        ) : (
          <section className="mx-3 mt-3 overflow-hidden rounded-xl bg-white" aria-label="菜品种类列表">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-3 border-b border-stone-100 px-4 py-3 last:border-b-0">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-(--theme-color-soft) text-(--theme-color)">
                  <span className="icon-[lucide--tag] size-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-stone-800">
                  {category.name}
                </span>
                <button type="button" aria-label={`编辑${category.name}`} onClick={() => openEdit(category)} className="grid size-9 place-items-center rounded-full text-stone-500 active:bg-stone-100">
                  <span className="icon-[lucide--pencil] size-4" />
                </button>
                <button type="button" aria-label={`删除${category.name}`} onClick={() => setDeleting(category)} className="grid size-9 place-items-center rounded-full text-red-400 active:bg-red-50">
                  <span className="icon-[lucide--trash-2] size-4" />
                </button>
              </div>
            ))}
          </section>
        )}
      </Page.Content>

      <Dialog
        open={editorOpen}
        title={editing ? "编辑菜品种类" : "添加菜品种类"}
        showCancel
        confirmText={saving ? "保存中…" : "保存"}
        maskClosable={false}
        classes={{ confirmButton: "bg-(--theme-color)/10 text-(--theme-color)" }}
        onConfirm={() => void saveCategory()}
        onCancel={closeEditor}
        onClose={closeEditor}
      >
        <InputGroup className="h-10 rounded-full border-0 bg-[#f3f3f3] shadow-none">
          <InputGroupInput
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="请输入种类名称"
            aria-label="种类名称"
            maxLength={100}
            className="h-auto bg-transparent px-3.5 text-center text-[#333] placeholder:text-[#aaa]"
          />
        </InputGroup>
      </Dialog>

      <Dialog
        open={Boolean(deleting)}
        title="删除菜品种类"
        showCancel
        confirmText={saving ? "删除中…" : "删除"}
        classes={{ confirmButton: "bg-red-50 text-red-500" }}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleting(null)}
        onClose={() => setDeleting(null)}
      >
        <p>确定删除“{deleting?.name}”吗？仍被菜品使用的种类无法删除。</p>
      </Dialog>
    </Page>
  );
}

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  createMenuCategory,
  deleteMenuCategory,
  getMenuCategories,
  updateMenuCategoryOrder,
  updateMenuCategory,
} from "@/api/endpoints/menu";
import { Dialog, Page } from "@/components";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useFamilyStore } from "@/store";
import type { ApiMenuCategory } from "@/types";

interface SortableCategoryRowProps {
  category: ApiMenuCategory;
  editing: boolean;
  name: string;
  onNameChange: (name: string) => void;
  onDelete: () => void;
}

function SortableCategoryRow({
  category,
  editing,
  name,
  onNameChange,
  onDelete,
}: SortableCategoryRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`flex items-center gap-3 border-b border-stone-100 px-3 py-2 last:border-b-0 ${isDragging ? "relative z-10 bg-white shadow-sm" : ""}`}
    >
      {editing ? (
        <button
          type="button"
          aria-label={`拖动${category.name}`}
          className="bg-muted-foreground/15 grid size-7 shrink-0 touch-none place-items-center rounded-full text-stone-500"
          {...attributes}
          {...listeners}
        >
          <span className="icon-[akar-icons--drag-horizontal-fill] size-4" />
        </button>
      ) : (
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-(--theme-color-soft) text-(--theme-color)">
          <span className="icon-[lucide--tag] size-3.5" />
        </span>
      )}
      {editing ? (
        <input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          aria-label={`编辑${category.name}`}
          maxLength={100}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-stone-800 outline-none"
        />
      ) : (
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-stone-800">
          {category.name}
        </span>
      )}
      <AnimatePresence initial={false}>
        {editing && (
          <motion.button
            type="button"
            aria-label={`删除${category.name}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            onClick={onDelete}
            className="grid size-5.5 shrink-0 place-items-center rounded-full bg-(--lc-red) text-white"
          >
            <span className="icon-[tabler--minus] size-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CategoriesPage() {
  useDocumentTitle("菜品种类");
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const [categories, setCategories] = useState<ApiMenuCategory[]>([]);
  const [savedCategoryIds, setSavedCategoryIds] = useState<string[]>([]);
  const [loadedFamilyId, setLoadedFamilyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [names, setNames] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleting, setDeleting] = useState<ApiMenuCategory | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  useEffect(() => {
    if (!currentFamilyId) return;
    let cancelled = false;
    getMenuCategories()
      .then((result) => {
        if (cancelled) return;
        setEditing(false);
        setCategories(result.items);
        setSavedCategoryIds(result.items.map((item) => item.id));
        setNames(
          Object.fromEntries(result.items.map((item) => [item.id, item.name])),
        );
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

  const loading =
    Boolean(currentFamilyId) && loadedFamilyId !== currentFamilyId;

  function openAdd() {
    setName("");
    setEditorOpen(true);
  }

  function closeEditor() {
    setName("");
    setEditorOpen(false);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    setCategories((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return items;
      const next = arrayMove(items, oldIndex, newIndex);
      return next;
    });
  }

  async function saveEdits() {
    if (saving) return;
    const changed = categories.filter(
      (category) => (names[category.id] ?? "").trim() !== category.name,
    );
    if (changed.some((category) => !(names[category.id] ?? "").trim())) {
      toast.add({ type: "error", title: "种类名称不能为空" });
      return;
    }
    const categoryIds = categories.map((category) => category.id);
    const orderChanged =
      categoryIds.length !== savedCategoryIds.length ||
      categoryIds.some((id, index) => id !== savedCategoryIds[index]);
    if (changed.length === 0 && !orderChanged) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const updated = await Promise.all(
        changed.map((category) =>
          updateMenuCategory(category.id, {
            name: (names[category.id] ?? "").trim(),
          }),
        ),
      );
      const byId = new Map(updated.map((category) => [category.id, category]));
      let nextCategories = categories.map(
        (category) => byId.get(category.id) ?? category,
      );
      if (orderChanged) {
        nextCategories = await updateMenuCategoryOrder(categoryIds);
      }
      setCategories(nextCategories);
      setSavedCategoryIds(nextCategories.map((category) => category.id));
      setNames(
        Object.fromEntries(
          nextCategories.map((category) => [category.id, category.name]),
        ),
      );
      setEditing(false);
      toast.add({ type: "success", title: "菜品种类已保存" });
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setSaving(false);
    }
  }

  async function saveCategory() {
    const trimmedName = name.trim();
    if (!trimmedName || saving) return;
    setSaving(true);
    try {
      const result = await createMenuCategory({ name: trimmedName });
      setCategories((items) => [...items, result]);
      setSavedCategoryIds((ids) => [...ids, result.id]);
      setNames((values) => ({ ...values, [result.id]: result.name }));
      closeEditor();
      toast.add({ type: "success", title: "种类已添加" });
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
      setNames((values) => {
        const next = { ...values };
        delete next[deleting.id];
        return next;
      });
      setSavedCategoryIds((ids) => ids.filter((id) => id !== deleting.id));
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
          categories.length > 0 ? (
            <button
              type="button"
              aria-label={editing ? "保存菜品种类" : "编辑菜品种类"}
              onClick={() => (editing ? void saveEdits() : setEditing(true))}
              disabled={saving}
              className={`hover:bg-muted-foreground/15 active:bg-muted-foreground/15 grid size-10 place-items-center rounded-full text-stone-700 transition-colors ${editing ? "bg-muted-foreground/15" : ""}`}
            >
              <span
                className={`${editing ? "icon-[tabler--check-filled]" : "icon-[ci--edit-pencil-01]"} size-5.5`}
              />
            </button>
          ) : null
        }
      />
      <Page.Content>
        {!currentFamilyId ? (
          <div className="px-6 py-16 text-center text-sm text-[#999]">
            请先创建家庭
          </div>
        ) : loading ? (
          <div className="px-6 py-16 text-center text-sm text-[#999]">
            加载中…
          </div>
        ) : categories.length === 0 ? (
          <section
            className="mx-3 mt-3 overflow-hidden rounded-2xl bg-white"
            aria-label="菜品种类列表"
          >
            <div className="px-6 py-10 text-center text-[13px] text-[#999]">
              还没有菜品种类
            </div>
            <button
              type="button"
              onClick={openAdd}
              className="flex h-9.5 w-full items-center justify-center gap-1 border-t border-stone-100 text-[13px] font-semibold text-(--theme-color)"
            >
              <span className="icon-[tabler--plus] size-4" />
              添加菜品种类
            </button>
          </section>
        ) : (
          <section
            className="mx-3 mt-3 overflow-hidden rounded-2xl bg-white"
            aria-label="菜品种类列表"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={categories.map((category) => category.id)}
                strategy={verticalListSortingStrategy}
              >
                {categories.map((category) => (
                  <SortableCategoryRow
                    key={category.id}
                    category={category}
                    editing={editing}
                    name={names[category.id] ?? category.name}
                    onNameChange={(value) =>
                      setNames((values) => ({
                        ...values,
                        [category.id]: value,
                      }))
                    }
                    onDelete={() => setDeleting(category)}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <button
              type="button"
              onClick={openAdd}
              className="flex h-9.5 w-full items-center justify-center gap-1 text-[13px] font-semibold text-(--theme-color)"
            >
              <span className="icon-[tabler--plus] size-4" />
              添加菜品种类
            </button>
          </section>
        )}
      </Page.Content>

      <Dialog
        open={editorOpen}
        title="添加菜品种类"
        showCancel
        confirmText={saving ? "保存中…" : "保存"}
        maskClosable={false}
        classes={{
          content: "pb-0.5",
          confirmButton: "bg-(--theme-color)/10 text-(--theme-color)",
        }}
        onConfirm={() => void saveCategory()}
        onCancel={closeEditor}
        onClose={closeEditor}
      >
        <InputGroup className="h-10 rounded-full border-0 bg-[#f8f8f8] shadow-none">
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

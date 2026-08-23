import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import { createDraft, updateDraft } from "@/api/endpoints/drafts";
import { dishToMenuItem } from "@/api/endpoints/adapters";
import { createMenuCategory, getMenu } from "@/api/endpoints/menu";
import { Dialog, FamilyRequired, FoodCard } from "@/components";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useCartStore, useFamilyStore } from "@/store";
import { toast } from "@/components/ui/toast";
import { cn } from "@/utils";
import type { MenuListResult } from "@/types";

const ALL_CATEGORY = "全部";

export default function HomePage() {
  useDocumentTitle("菜单");
  const navigate = useNavigate();
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const [menuResult, setMenuResult] = useState<MenuListResult | null>(null);
  const [loadedFamilyId, setLoadedFamilyId] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const [keyword, setKeyword] = useState("");
  const [showSelected, setShowSelected] = useState(false);
  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);
  const selectedItems = useCartStore((state) => state.items);
  const toggleItem = useCartStore((state) => state.toggleItem);
  const clearSelected = useCartStore((state) => state.clear);
  const selectedIds = useMemo(
    () => new Set(selectedItems.map((item) => item.id)),
    [selectedItems],
  );

  useEffect(() => {
    if (!currentFamilyId) return;
    let cancelled = false;
    getMenu()
      .then((result) => {
        if (cancelled) return;
        setMenuResult(result);
      })
      .catch(() => {
        if (!cancelled) setMenuResult({ categories: [], items: [] });
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

  const categoryTabs = useMemo(() => {
    const names = (menuResult?.categories ?? [])
      .map((category) => category.name)
      .filter(Boolean);
    return [ALL_CATEGORY, ...new Set(names)];
  }, [menuResult]);

  const allMenuItems = useMemo(
    () => (menuResult?.items ?? []).map(dishToMenuItem),
    [menuResult],
  );

  const visibleItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase();

    return allMenuItems.filter((item) => {
      if (!normalizedKeyword) {
        return (
          activeCategory === ALL_CATEGORY || item.category === activeCategory
        );
      }

      return [item.name, item.ingredients, item.seasonings]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedKeyword);
    });
  }, [activeCategory, allMenuItems, keyword]);
  const listStateKey = keyword.trim() ? "search" : activeCategory;

  function handleClearSelected() {
    setShowSelected(false);
    clearSelected();
  }

  async function handleSaveDraft() {
    if (!selectedItems.length || !currentFamilyId) return;
    const editingDraftId = localStorage.getItem("order-food-editing-draft");
    const dishIds = selectedItems.map((item) => item.id);
    try {
      if (editingDraftId) {
        await updateDraft(editingDraftId, { dishIds });
        localStorage.removeItem("order-food-editing-draft");
      } else {
        await createDraft({ dishIds });
      }
      clearSelected();
      setShowSelected(false);
      navigate(routePaths.drafts);
    } catch {
      /* 全局错误提示已处理 */
    }
  }

  function handleOrder() {
    localStorage.removeItem("order-food-editing-draft");
    navigate(routePaths.orderConfirm);
  }

  function openCategoryEditor() {
    setCategoryName("");
    setCategoryEditorOpen(true);
  }

  function closeCategoryEditor() {
    setCategoryName("");
    setCategoryEditorOpen(false);
  }

  async function saveCategory() {
    const trimmedName = categoryName.trim();
    if (!trimmedName || categorySaving) return;
    setCategorySaving(true);
    try {
      const category = await createMenuCategory({ name: trimmedName });
      setMenuResult((current) =>
        current
          ? { ...current, categories: [...current.categories, category] }
          : { categories: [category], items: [] },
      );
      closeCategoryEditor();
      toast.add({ type: "success", title: "种类已添加" });
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setCategorySaving(false);
    }
  }

  if (!currentFamilyId) {
    return <FamilyRequired />;
  }

  return (
    <div className="relative flex h-[calc(100dvh-var(--layout-bottom-offset))] min-h-120 flex-col overflow-hidden bg-white">
      <header className="flex h-14 shrink-0 items-end bg-white px-2 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <InputGroup className="h-9 min-w-0 flex-1 rounded-full border-0 bg-[#f8f8f8] shadow-none">
            <InputGroupAddon align="inline-start" className="pl-2 text-[#999]">
              <span
                className="icon-[lucide--search] size-5"
                aria-hidden="true"
              />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索菜名、食材、配料"
              aria-label="搜索菜品"
              className="h-auto bg-transparent text-sm text-[#333] placeholder:text-[#aaa] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
            />
            {keyword && (
              <InputGroupAddon align="inline-end" className="pr-1">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  aria-label="清空搜索"
                  onClick={() => setKeyword("")}
                  className="text-[#999] hover:text-[#555]"
                >
                  <span className="icon-[lucide--circle-x] size-5" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
          <button
            type="button"
            aria-label="添加菜品"
            onClick={() => navigate(routePaths.addDish)}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-(--theme-color)/10 text-(--theme-color) transition-colors hover:opacity-90 active:opacity-80"
          >
            <span className="icon-[lucide--plus] size-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "flex h-full w-25 shrink-0 flex-col overflow-hidden rounded-tr-2xl bg-[#f8f8f8]",
            selectedItems.length > 0 && "pb-14",
          )}
          aria-label="菜品分类"
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            {categoryTabs.map((category) => {
              const isActive = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "block h-12 w-full truncate border-l-3 border-transparent px-3 text-left text-sm leading-12 font-bold text-[#555] transition-colors",
                    isActive &&
                      "border-l-(--theme-color) bg-white text-(--theme-color)",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            aria-label="添加菜品种类"
            onClick={openCategoryEditor}
            className="mx-2 my-2 flex h-9 shrink-0 items-center justify-center rounded-full bg-(--theme-color)/10 text-(--theme-color) transition-colors hover:opacity-90 active:opacity-80"
          >
            <span className="icon-[lucide--plus] size-5" aria-hidden="true" />
            <span className="ml-1 text-sm font-medium">种类</span>
          </button>
        </aside>

        <section
          className={cn(
            "min-w-0 flex-1 overflow-y-auto bg-white",
            selectedItems.length > 0 && "pb-14",
          )}
          aria-label="菜品列表"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={listStateKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, pointerEvents: "auto" }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              {loading ? (
                <div className="grid min-h-40 place-items-center px-5 text-center text-sm font-medium text-[#999]">
                  加载中…
                </div>
              ) : visibleItems.length > 0 ? (
                visibleItems.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    selected={selectedIds.has(item.id)}
                    keyword={keyword}
                    onToggle={toggleItem}
                    linkTo={`/menu/${item.id}`}
                    imageSize="lg"
                  />
                ))
              ) : (
                <div className="grid min-h-40 place-items-center px-5 text-center text-sm font-medium text-[#999]">
                  未找到相关菜品
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      <AnimatePresence>
        {showSelected && selectedItems.length > 0 && (
          <>
            <motion.button
              type="button"
              aria-label="关闭已选菜品"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSelected(false)}
              className="absolute inset-0 z-20 bg-black/30"
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="selected-dishes-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="absolute inset-x-0 bottom-14 z-30 max-h-77.5 overflow-hidden rounded-t-xl bg-white"
            >
              <header className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
                <h2
                  id="selected-dishes-title"
                  className="text-sm font-semibold text-[#222]"
                >
                  已选菜品（{selectedItems.length}）
                </h2>
                <button
                  type="button"
                  onClick={handleClearSelected}
                  className="text-[13px] font-medium text-(--theme-color)"
                >
                  清空
                </button>
              </header>
              <div className="max-h-64 overflow-y-auto pb-2.5">
                {selectedItems.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    imageSize="md"
                    onClick={() => {
                      setActiveCategory(item.category);
                      setShowSelected(false);
                    }}
                  />
                ))}
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className={cn(
              "absolute inset-x-0 bottom-0 z-40 flex h-14 items-center gap-2 bg-white px-3 text-sm transition-shadow duration-200",
              !showSelected && "shadow-[0_-0.0625rem_0.5rem_rgba(0,0,0,0.08)]",
            )}
          >
            <button
              type="button"
              onClick={() => setShowSelected((open) => !open)}
              className="min-w-0 flex-1 truncate text-left text-[#222]"
            >
              已选 {selectedItems.length} 道菜
            </button>
            <div className="flex shrink-0 overflow-hidden rounded-full">
              <button
                type="button"
                onClick={() => void handleSaveDraft()}
                className="h-8.5 bg-(--theme-color-soft) px-3.5 text-sm font-bold text-(--theme-color) active:bg-(--theme-color-soft-active)"
              >
                存草稿
              </button>
              <button
                type="button"
                onClick={handleOrder}
                className="h-8.5 bg-(--theme-color) px-3.5 text-sm font-bold text-white active:bg-(--theme-color-active)"
              >
                下单
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={categoryEditorOpen}
        title="添加菜品种类"
        showCancel
        confirmText={categorySaving ? "保存中…" : "保存"}
        maskClosable={false}
        classes={{
          content: "pb-0.5",
          confirmButton: "bg-(--theme-color)/10 text-(--theme-color)",
        }}
        onConfirm={() => void saveCategory()}
        onCancel={closeCategoryEditor}
        onClose={closeCategoryEditor}
      >
        <InputGroup className="h-10 rounded-full border-0 bg-[#f8f8f8] shadow-none">
          <InputGroupInput
            autoFocus
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="请输入种类名称"
            aria-label="种类名称"
            maxLength={100}
            className="h-auto bg-transparent px-3.5 text-center text-[#333] placeholder:text-[#aaa]"
          />
        </InputGroup>
      </Dialog>
    </div>
  );
}

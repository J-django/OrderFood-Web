import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FoodCard } from "@/components";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { menuCategories, menuItems } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useCartStore } from "@/store";
import { cn } from "@/utils";
import type { MenuCategory } from "@/types";

const categoryTabs = menuCategories.filter(
  (category): category is MenuCategory => category !== "全部",
);

export default function HomePage() {
  useDocumentTitle("菜单");
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(
    categoryTabs[0],
  );
  const [keyword, setKeyword] = useState("");
  const [showSelected, setShowSelected] = useState(false);
  const selectedItems = useCartStore((state) => state.items);
  const toggleItem = useCartStore((state) => state.toggleItem);
  const clearSelected = useCartStore((state) => state.clear);
  const selectedIds = useMemo(
    () => new Set(selectedItems.map((item) => item.id)),
    [selectedItems],
  );

  const visibleItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase();

    return menuItems.filter((item) => {
      if (!normalizedKeyword) {
        return item.category === activeCategory;
      }

      return [item.name, item.ingredients, item.seasonings]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedKeyword);
    });
  }, [activeCategory, keyword]);
  const listStateKey = keyword.trim() ? "search" : activeCategory;

  function handleClearSelected() {
    setShowSelected(false);
    clearSelected();
  }

  return (
    <div className="relative flex h-[calc(100dvh-64px-env(safe-area-inset-bottom))] min-h-[480px] flex-col overflow-hidden bg-white">
      <header className="shrink-0 bg-white px-2.5 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-2.5">
        <InputGroup className="h-9 rounded-full border-0 bg-[#f3f3f3] shadow-none">
          <InputGroupAddon align="inline-start" className="pl-2 text-[#999]">
            <span className="icon-[lucide--search] size-5" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索菜名、食材、配料"
            aria-label="搜索菜品"
            className="h-auto bg-transparent text-sm text-[#333] placeholder:text-[#aaa]"
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
                <span className="icon-[lucide--circle-x] size-[18px]" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className="h-full w-[100px] shrink-0 overflow-y-auto rounded-tr-xl bg-[#f8f8f8]"
          aria-label="菜品分类"
        >
          {categoryTabs.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "block h-12 w-full truncate border-l-[3px] border-transparent px-3 text-left text-sm leading-[48px] font-normal text-[#555] transition-colors",
                  isActive &&
                    "border-l-[#ff5f15] bg-white font-semibold text-[#ff5f15]",
                )}
              >
                {category}
              </button>
            );
          })}
        </aside>

        <section
          className={cn(
            "min-w-0 flex-1 overflow-y-auto bg-white",
            selectedItems.length > 0 && "pb-[65px]",
          )}
          aria-label="菜品列表"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={listStateKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, pointerEvents: "auto" }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              {visibleItems.length > 0 ? (
                visibleItems.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    selected={selectedIds.has(item.id)}
                    keyword={keyword}
                    onToggle={toggleItem}
                  />
                ))
              ) : (
                <div className="grid min-h-40 place-items-center px-5 text-center text-[13px] text-[#999]">
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
              className="absolute inset-x-0 bottom-[55px] z-30 max-h-[310px] overflow-hidden rounded-t-xl bg-white"
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
                  className="text-xs text-[#ff5f15]"
                >
                  清空
                </button>
              </header>
              <div className="max-h-[255px] overflow-y-auto pb-2.5">
                {selectedItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(item.category);
                      setShowSelected(false);
                    }}
                    className="flex w-full items-start border-b border-[#f0f0f0] px-3 py-2.5 text-left last:border-b-0"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="size-[60px] shrink-0 rounded-[10px] object-cover"
                    />
                    <span className="ml-2 min-w-0 flex-1">
                      <span className="block text-base leading-[22px] font-semibold text-[#222]">
                        {item.name}
                      </span>
                      <span className="mt-[3px] block text-xs leading-4 text-[#777]">
                        <span className="font-medium text-[#555]">食材：</span>
                        {item.ingredients}
                      </span>
                      <span className="mt-px block text-xs leading-4 text-[#777]">
                        <span className="font-medium text-[#555]">配料：</span>
                        {item.seasonings}
                      </span>
                    </span>
                  </button>
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
            className="absolute inset-x-0 bottom-0 z-40 flex h-[55px] items-center gap-2 bg-white px-3 text-sm shadow-[0_-1px_8px_rgba(0,0,0,0.08)]"
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
                className="h-[34px] bg-[#fff1e9] px-3.5 text-[13px] text-[#ff5f15] active:bg-[#ffe5d6]"
              >
                存草稿
              </button>
              <button
                type="button"
                className="h-[34px] bg-[#ff5f15] px-3.5 text-[13px] text-white active:bg-[#e94f0b]"
              >
                下单
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

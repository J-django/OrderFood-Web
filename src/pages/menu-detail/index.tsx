import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { dishToMenuItem } from "@/api/endpoints/adapters";
import { getDish, getMenuCategories, updateDish } from "@/api/endpoints/menu";
import { ActionButton, ImagePicker, Page, PresenceFade } from "@/components";
import { Image } from "@/components/image";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMAGE_MAX_SIZE, IMAGE_MAX_SIZE_LABEL } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useFamilyStore } from "@/store";
import type { ApiMenuCategory, MenuItem } from "@/types";

type MenuDraft = {
  name: string;
  image: string;
  categoryId: string;
  ingredients: string;
  seasonings: string;
  method: string;
};

type MenuDetailDisplayProps = {
  dish: MenuItem;
};

function MenuDetailDisplay({ dish }: MenuDetailDisplayProps) {
  return (
    <>
      <Image
        src={dish.image}
        alt={dish.name}
        classes={{
          container: "aspect-4/3 rounded-2xl bg-stone-100",
          image: "object-cover",
        }}
      />
      <div className="mt-2 space-y-1 px-1.5 pb-6 text-sm leading-5.5">
        <h2 className="text-xl leading-7 font-semibold text-[#222]">
          {dish.name}
        </h2>
        <p className="flex text-[#555]">
          <b className="font-semibold whitespace-nowrap">品类：</b>
          {dish.category || "暂无"}
        </p>
        <p className="flex items-start text-[#555]">
          <b className="font-semibold whitespace-nowrap">食材：</b>
          <span className="min-w-0 flex-1 wrap-break-word whitespace-pre-wrap">
            {dish.ingredients || "暂无"}
          </span>
        </p>
        <p className="flex items-start text-[#555]">
          <b className="font-semibold whitespace-nowrap">配料：</b>
          <span className="min-w-0 flex-1 wrap-break-word whitespace-pre-wrap">
            {dish.seasonings || "暂无"}
          </span>
        </p>
        <div className="flex items-start">
          <p className="shrink-0 font-semibold whitespace-nowrap text-[#555]">
            做法：
          </p>
          <p className="min-w-0 flex-1 wrap-break-word whitespace-pre-wrap text-[#555]">
            {dish.method || "暂无"}
          </p>
        </div>
      </div>
    </>
  );
}

type MenuDetailEditorProps = {
  dish: MenuItem;
  draft: MenuDraft;
  categories: ApiMenuCategory[];
  onDraftChange: (patch: Partial<MenuDraft>) => void;
};

function MenuDetailEditor({
  dish,
  draft,
  categories,
  onDraftChange,
}: MenuDetailEditorProps) {
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const selectedCategory = categories.find(
    (category) => category.id === draft.categoryId,
  );

  function openCategoryDrawer() {
    if (categories.length === 0) {
      toast.add({
        type: "error",
        title: "请先添加菜品种类",
      });
      return;
    }
    setCategoryDrawerOpen(true);
  }

  return (
    <>
      <ImagePicker
        src={draft.image}
        alt={draft.name}
        maxSize={IMAGE_MAX_SIZE}
        selectLabel="更换菜品图片"
        deleteLabel="删除菜品图片"
        onChange={(image) => onDraftChange({ image })}
        onDelete={() => onDraftChange({ image: "" })}
        onFileTooLarge={() =>
          toast.add({
            type: "error",
            title: `图片大小不能超过 ${IMAGE_MAX_SIZE_LABEL}`,
          })
        }
      />
      <div className="mt-2 space-y-1 px-1.5 pb-6 text-sm leading-5.5">
        <Input
          value={draft.name}
          onChange={(event) => onDraftChange({ name: event.target.value })}
          aria-label="菜名"
          maxLength={120}
          className="h-7 w-full rounded-lg border-none p-0 text-xl leading-7 font-semibold text-[#222] outline-none placeholder:text-[#999]"
        />
        <p className="flex text-[#555]">
          <b className="font-semibold whitespace-nowrap">品类：</b>
          <Button
            type="button"
            disablePressMotion={true}
            onClick={openCategoryDrawer}
            className="h-min w-min justify-between gap-0.5 rounded-none border-none bg-transparent p-0 text-left text-sm leading-5.5 font-normal text-[#555]"
          >
            <span>{selectedCategory?.name || dish.category || "暂无"}</span>
            <span className="icon-[lucide--chevron-down] size-4.5 text-[#999]" />
          </Button>
        </p>
        <p className="flex text-[#555]">
          <b className="font-semibold whitespace-nowrap">食材：</b>
          <Textarea
            value={draft.ingredients}
            onChange={(event) =>
              onDraftChange({ ingredients: event.target.value })
            }
            aria-label="食材"
            rows={0}
            className="min-h-auto flex-1 resize-none rounded-xl border-none bg-white p-0 text-sm leading-5.5 text-[#555] outline-none placeholder:text-[#999]"
          />
        </p>
        <p className="flex text-[#555]">
          <b className="font-semibold whitespace-nowrap">配料：</b>
          <Textarea
            value={draft.seasonings}
            onChange={(event) =>
              onDraftChange({ seasonings: event.target.value })
            }
            aria-label="配料"
            rows={0}
            className="min-h-auto flex-1 resize-none rounded-xl border-none bg-white p-0 text-sm leading-5.5 text-[#555] outline-none placeholder:text-[#999]"
          />
        </p>
        <div className="flex items-start">
          <p className="shrink-0 font-semibold whitespace-nowrap text-[#555]">
            做法：
          </p>
          <Textarea
            value={draft.method}
            onChange={(event) => onDraftChange({ method: event.target.value })}
            aria-label="做法"
            rows={0}
            className="min-h-auto flex-1 resize-none rounded-xl border-none bg-white p-0 text-sm leading-5.5 text-[#555] outline-none placeholder:text-[#999]"
          />
        </div>
      </div>
      <Drawer open={categoryDrawerOpen} onOpenChange={setCategoryDrawerOpen}>
        <DrawerContent className="!rounded-b-none bg-white [--drawer-inset:0rem]">
          <div className="px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
            {categories.map((item) => {
              const selected = draft.categoryId === item.id;
              return (
                <Button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    onDraftChange({ categoryId: item.id });
                    setCategoryDrawerOpen(false);
                  }}
                  disablePressMotion={true}
                  className="flex h-12 w-full items-center justify-between rounded-full bg-white px-5 text-left text-sm text-[#222] active:bg-[#f5f5f5]"
                >
                  <span>{item.name}</span>
                  {selected && (
                    <span className="icon-[lucide--check] size-5 text-(--theme-color)" />
                  )}
                </Button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function MenuDetailPage() {
  const { itemId } = useParams();
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const [dish, setDish] = useState<MenuItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ApiMenuCategory[]>([]);
  const [currentCategoryId, setCurrentCategoryId] = useState("");
  const [draft, setDraft] = useState<MenuDraft>({
    name: "",
    image: "",
    categoryId: "",
    ingredients: "",
    seasonings: "",
    method: "",
  });
  useDocumentTitle(dish?.name ?? "菜品详情");

  useEffect(() => {
    if (!currentFamilyId) return;
    getMenuCategories()
      .then((result) => setCategories(result.items))
      .catch(() => setCategories([]));
  }, [currentFamilyId]);

  useEffect(() => {
    if (!itemId) return;
    let cancelled = false;
    getDish(itemId)
      .then((result) => {
        if (!cancelled) {
          const nextDish = dishToMenuItem(result);
          setDish(nextDish);
          setCurrentCategoryId(result.categoryId);
          setDraft({
            name: nextDish.name,
            image: nextDish.image,
            categoryId: result.categoryId,
            ingredients: nextDish.ingredients,
            seasonings: nextDish.seasonings,
            method: nextDish.method,
          });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  if (notFound) {
    return <Navigate to="/" replace />;
  }

  function startEditing() {
    if (!dish || saving) return;
    setDraft({
      name: dish.name,
      image: dish.image,
      categoryId: currentCategoryId,
      ingredients: dish.ingredients,
      seasonings: dish.seasonings,
      method: dish.method,
    });
    setEditing(true);
  }

  async function saveEdits() {
    if (!dish || !itemId || saving) return;
    const name = draft.name.trim();
    const image = draft.image;
    const categoryId = draft.categoryId;
    const ingredients = draft.ingredients.trim();
    const seasonings = draft.seasonings.trim();
    const method = draft.method.trim();
    const unchanged =
      name === dish.name &&
      image === dish.image &&
      categoryId === currentCategoryId &&
      ingredients === dish.ingredients &&
      seasonings === dish.seasonings &&
      method === dish.method;
    if (unchanged) {
      setEditing(false);
      return;
    }
    if (!name) {
      toast.add({ type: "error", title: "菜名不能为空" });
      return;
    }
    setSaving(true);
    try {
      const result = await updateDish(itemId, {
        name,
        ...(image !== dish.image ? { images: image ? [image] : [] } : {}),
        ...(categoryId !== currentCategoryId ? { categoryId } : {}),
        ingredients,
        garnishes: seasonings,
        method,
      });
      const nextDish = dishToMenuItem(result);
      setDish(nextDish);
      setCurrentCategoryId(result.categoryId);
      setDraft({
        name: nextDish.name,
        image: nextDish.image,
        categoryId: result.categoryId,
        ingredients: nextDish.ingredients,
        seasonings: nextDish.seasonings,
        method: nextDish.method,
      });
      setEditing(false);
      toast.add({ type: "success", title: "菜品已保存" });
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setSaving(false);
    }
  }

  if (!dish) {
    return (
      <Page className="bg-white">
        <Page.Header title="菜品详情" backTo="/" />
        <Page.Content>
          <div className="grid min-h-60 place-items-center text-sm text-[#999]">
            加载中…
          </div>
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page className="bg-white">
      <Page.Header
        title="菜品详情"
        backTo="/"
        trailing={
          <ActionButton
            type="button"
            aria-label={editing ? "完成编辑菜品" : "编辑菜品"}
            onClick={() => (editing ? void saveEdits() : startEditing())}
            disabled={saving}
          >
            <PresenceFade
              as="span"
              mode="popLayout"
              stateKey={editing ? "editing" : "viewing"}
              className="inline-flex size-5.5"
            >
              <span
                className={`${editing ? "icon-[lucide--check]" : "icon-[tabler--pencil]"} size-5.5`}
              />
            </PresenceFade>
          </ActionButton>
        }
      />
      <Page.Content className="p-2.5">
        {editing ? (
          <MenuDetailEditor
            dish={dish}
            draft={draft}
            categories={categories}
            onDraftChange={(patch) =>
              setDraft((value) => ({ ...value, ...patch }))
            }
          />
        ) : (
          <MenuDetailDisplay dish={dish} />
        )}
      </Page.Content>
    </Page>
  );
}

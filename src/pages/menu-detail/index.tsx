import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router";
import { dishToMenuItem } from "@/api/endpoints/adapters";
import { getDish, getMenuCategories, updateDish } from "@/api/endpoints/menu";
import { Page } from "@/components";
import { Image } from "@/components/image";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getMenuItem } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useFamilyStore } from "@/store";
import type { ApiMenuCategory, MenuItem } from "@/types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function MenuDetailPage() {
  const { itemId } = useParams();
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dish, setDish] = useState<MenuItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ApiMenuCategory[]>([]);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState("");
  const [draft, setDraft] = useState({
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
        const fallback = getMenuItem(itemId);
        if (fallback) {
          setDish(fallback);
          setCurrentCategoryId("");
          setDraft({
            name: fallback.name,
            image: fallback.image,
            categoryId: "",
            ingredients: fallback.ingredients,
            seasonings: fallback.seasonings,
            method: fallback.method,
          });
        } else {
          setNotFound(true);
        }
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

  function chooseImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    if (file.size > MAX_IMAGE_SIZE) {
      toast.add({ type: "error", title: "图片大小不能超过 5MB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setDraft((value) => ({ ...value, image: String(reader.result) }));
    reader.readAsDataURL(file);
  }

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

  const selectedCategory = categories.find(
    (category) => category.id === draft.categoryId,
  );

  return (
    <Page className="bg-white">
      <Page.Header
        title="菜品详情"
        backTo="/"
        trailing={
          <button
            type="button"
            aria-label={editing ? "保存菜品" : "编辑菜品"}
            onClick={() => (editing ? void saveEdits() : startEditing())}
            disabled={saving}
            className={`hover:bg-muted-foreground/15 active:bg-muted-foreground/15 grid size-10 place-items-center rounded-full text-stone-700 transition-colors ${editing ? "bg-muted-foreground/15" : ""}`}
          >
            <span
              className={`${editing ? "icon-[tabler--check-filled]" : "icon-[ci--edit-pencil-01]"} size-5.5`}
            />
          </button>
        }
      />
      <Page.Content className={editing ? "bg-[#f8f8f8]" : undefined}>
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={chooseImage}
        />
        {editing ? (
          <Button
            type="button"
            aria-label="更换菜品图片"
            onClick={() => inputRef.current?.click()}
            disablePressMotion={true}
            className="group relative mx-4 mt-4 flex aspect-4/3 h-auto w-[calc(100%-2rem)] flex-col items-center justify-center overflow-hidden rounded-2xl border-none bg-white px-0 text-sm text-[#999]"
          >
            <Image
              src={draft.image}
              alt={draft.name}
              classes={{
                container: "size-full",
                image: "object-cover",
              }}
            />
            <span className="absolute inset-0 grid place-items-center bg-black/20 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="icon-[lucide--camera] size-7" />
            </span>
          </Button>
        ) : (
          <Image
            src={dish.image}
            alt={dish.name}
            classes={{
              container:
                "mx-4 mt-4 aspect-4/3 w-[calc(100%-2rem)] rounded-2xl bg-stone-100",
              image: "object-cover",
            }}
          />
        )}
        <div className="px-4 pb-6">
          <section className="pt-3">
            {editing ? (
              <Input
                value={draft.name}
                onChange={(event) =>
                  setDraft((value) => ({ ...value, name: event.target.value }))
                }
                aria-label="菜名"
                maxLength={120}
                className="mt-2.5 h-10.5 w-full rounded-lg border-none bg-white px-3 text-sm text-[#222] outline-none placeholder:text-[#999]"
              />
            ) : (
              <h2 className="text-xl leading-7 font-semibold text-[#222]">
                {dish.name}
              </h2>
            )}
          </section>

          <div
            className={`mt-2 text-sm leading-5.5 text-[#777] ${editing ? "space-y-2.5" : "space-y-1"}`}
          >
            <p className="flex text-[#555]">
              <b className="font-semibold">品类：</b>
              {editing ? (
                <Button
                  type="button"
                  disablePressMotion={true}
                  onClick={openCategoryDrawer}
                  className="inline-flex h-10.5 flex-1 justify-between rounded-xl border-none bg-white px-3 text-left text-sm font-normal text-[#555]"
                >
                  <span>
                    {selectedCategory?.name || dish.category || "暂无"}
                  </span>
                  <span className="icon-[lucide--chevron-down] size-4 text-[#999]" />
                </Button>
              ) : (
                dish.category || "暂无"
              )}
            </p>
            <p className="flex text-[#555]">
              <b className="font-semibold">食材：</b>
              {editing ? (
                <Input
                  value={draft.ingredients}
                  onChange={(event) =>
                    setDraft((value) => ({
                      ...value,
                      ingredients: event.target.value,
                    }))
                  }
                  aria-label="食材"
                  className="inline-block h-10.5 w-[calc(100%-3.5rem)] flex-1 rounded-lg border-none bg-white px-3 text-sm text-[#555] outline-none placeholder:text-[#999]"
                />
              ) : (
                dish.ingredients || "暂无"
              )}
            </p>
            <p className="flex text-[#555]">
              <b className="font-semibold">配料：</b>
              {editing ? (
                <Input
                  value={draft.seasonings}
                  onChange={(event) =>
                    setDraft((value) => ({
                      ...value,
                      seasonings: event.target.value,
                    }))
                  }
                  aria-label="配料"
                  className="inline-block h-10.5 w-[calc(100%-3.5rem)] flex-1 rounded-lg border-none bg-white px-3 text-sm text-[#555] outline-none placeholder:text-[#999]"
                />
              ) : (
                dish.seasonings || "暂无"
              )}
            </p>
            <div className="flex items-start">
              <p className="shrink-0 font-semibold text-[#555]">做法：</p>
              {editing ? (
                <Textarea
                  value={draft.method}
                  onChange={(event) =>
                    setDraft((value) => ({
                      ...value,
                      method: event.target.value,
                    }))
                  }
                  aria-label="做法"
                  rows={4}
                  className="min-h-20 min-w-0 flex-1 resize-none rounded-xl border-none bg-white px-3 py-2.5 text-sm leading-5 text-[#555] outline-none placeholder:text-[#999]"
                />
              ) : (
                <p className="min-w-0 flex-1 whitespace-pre-wrap text-[#555]">
                  {dish.method || "暂无"}
                </p>
              )}
            </div>
          </div>
        </div>
      </Page.Content>
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
                    setDraft((value) => ({ ...value, categoryId: item.id }));
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
    </Page>
  );
}

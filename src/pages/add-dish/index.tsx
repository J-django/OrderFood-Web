import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createDish, getMenuCategories } from "@/api/endpoints/menu";
import { FamilyRequired, ImagePicker, Page } from "@/components";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMAGE_MAX_SIZE, IMAGE_MAX_SIZE_LABEL, routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useFamilyStore } from "@/store";
import type { ApiMenuCategory } from "@/types";

export default function AddDishPage() {
  useDocumentTitle("添加菜品");
  const navigate = useNavigate();
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [garnishes, setGarnishes] = useState("");
  const [method, setMethod] = useState("");
  const [categories, setCategories] = useState<ApiMenuCategory[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!currentFamilyId) return;
    getMenuCategories()
      .then((result) => setCategories(result.items))
      .catch(() => setCategories([]));
  }, [currentFamilyId]);

  const selectedCategory = categories.find((item) => item.id === categoryId);

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

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      toast.add({ type: "error", title: "请输入菜名" });
      return;
    }
    if (!currentFamilyId) {
      toast.add({ type: "error", title: "请先创建家庭" });
      return;
    }
    if (!categoryId) {
      toast.add({ type: "error", title: "请选择菜品种类" });
      return;
    }
    setSubmitting(true);
    try {
      await createDish({
        name: name.trim(),
        categoryId,
        images: image ? [image] : undefined,
        ingredients: ingredients.trim(),
        garnishes: garnishes.trim(),
        method: method.trim(),
      });
      toast.add({ type: "success", title: "菜品已添加" });
      navigate(routePaths.home);
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header title="添加菜品" backTo={routePaths.profile} />
      <Page.Content>
        {!currentFamilyId ? (
          <FamilyRequired className="min-h-full" />
        ) : (
          <form onSubmit={submit} className="p-2.5">
            <ImagePicker
              classes={{ container: "bg-white" }}
              src={image}
              alt="菜品预览"
              maxSize={IMAGE_MAX_SIZE}
              selectLabel="选择菜品图片"
              deleteLabel="删除菜品图片"
              onChange={setImage}
              onDelete={() => setImage("")}
              onFileTooLarge={() =>
                toast.add({
                  type: "error",
                  title: `图片大小不能超过 ${IMAGE_MAX_SIZE_LABEL}`,
                })
              }
            />
            <Button
              type="button"
              disablePressMotion={true}
              onClick={openCategoryDrawer}
              className="mt-2.5 flex h-10.5 w-full cursor-pointer items-center justify-between rounded-xl border-none bg-white px-3 text-left text-sm"
            >
              <span
                className={selectedCategory ? "text-[#222]" : "text-[#999]"}
              >
                {selectedCategory?.name || "种类"}
              </span>
              <span className="icon-[lucide--chevron-right] size-5 text-[#999]" />
            </Button>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="菜名"
              className="mt-2.5 h-10.5 w-full rounded-lg border-none bg-white px-3 text-sm outline-none placeholder:text-[#999]"
            />
            <Input
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              placeholder="食材"
              className="mt-2.5 h-10.5 w-full rounded-lg border-none bg-white px-3 text-sm outline-none placeholder:text-[#999]"
            />
            <Input
              value={garnishes}
              onChange={(event) => setGarnishes(event.target.value)}
              placeholder="配料"
              className="mt-2.5 h-10.5 w-full rounded-lg border-none bg-white px-3 text-sm outline-none placeholder:text-[#999]"
            />
            <Textarea
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              rows={5}
              placeholder="做法"
              className="mt-2.5 min-h-20 w-full resize-none rounded-xl border-none bg-white px-3 py-2.5 text-sm leading-5 outline-none placeholder:text-[#999]"
            />
            <Button
              type="submit"
              disablePressMotion={true}
              disabled={submitting}
              className="mt-5 h-10.5 w-full rounded-full bg-(--theme-color) text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "保存中…" : "保存菜品"}
            </Button>
          </form>
        )}
      </Page.Content>
      <Drawer open={categoryDrawerOpen} onOpenChange={setCategoryDrawerOpen}>
        <DrawerContent className="!rounded-b-none bg-white [--drawer-inset:0rem]">
          <div className="px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
            {categories.map((item) => {
              const selected = categoryId === item.id;
              return (
                <Button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setCategoryId(item.id);
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

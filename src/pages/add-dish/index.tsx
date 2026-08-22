import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { createDish, getMenuCategories } from "@/api/endpoints/menu";
import { Page } from "@/components";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useFamilyStore } from "@/store";
import type { ApiMenuCategory } from "@/types";

export default function AddDishPage() {
  useDocumentTitle("添加菜品");
  const navigate = useNavigate();
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<ApiMenuCategory[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentFamilyId) return;
    getMenuCategories()
      .then((result) => setCategories(result.items))
      .catch(() => setCategories([]));
  }, [currentFamilyId]);

  const selectedCategory = categories.find((item) => item.id === categoryId);

  function chooseImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError("请输入菜名");
      return;
    }
    if (!currentFamilyId) {
      setError("请先选择家庭");
      return;
    }
    if (!categoryId) {
      setError("请选择菜品种类");
      return;
    }
    setSubmitting(true);
    try {
      await createDish({
        name: name.trim(),
        categoryId,
        images: image ? [image] : undefined,
        method: description.trim(),
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
        <form onSubmit={submit} className="p-3.5">
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={chooseImage}
          />
          <Button
            type="button"
            disablePressMotion={true}
            onClick={() => inputRef.current?.click()}
            className="flex h-45 w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-white text-sm text-[#999]"
          >
            {image ? (
              <img
                src={image}
                alt="菜品预览"
                className="size-full object-cover"
              />
            ) : (
              <>
                <span className="icon-[lucide--plus] size-7" />
                <span className="mt-2">选择菜品图片</span>
              </>
            )}
          </Button>
          <Input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            placeholder="菜名"
            className="mt-2.5 h-10.5 w-full rounded-lg border-none bg-white px-3 text-sm outline-none placeholder:text-[#999]"
          />
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            placeholder="菜品描述"
            className="mt-2.5 min-h-20 w-full resize-none rounded-xl border-none bg-white px-3 py-2.5 text-sm leading-5 outline-none placeholder:text-[#999]"
          />
          <Button
            type="button"
            disablePressMotion={true}
            onClick={() => setCategoryDrawerOpen(true)}
            className="mt-2.5 flex h-10.5 w-full items-center justify-between rounded-xl border-none bg-white px-3 text-left text-sm"
          >
            <span className={selectedCategory ? "text-[#222]" : "text-[#999]"}>
              {selectedCategory?.name || "菜品种类"}
            </span>
            <span className="icon-[lucide--chevron-right] size-4 text-[#999]" />
          </Button>
          {error && <p className="mt-2 text-xs text-[#e53e20]">{error}</p>}
          <Button
            type="submit"
            disablePressMotion={true}
            disabled={submitting}
            className="mt-5 h-10.5 w-full rounded-full bg-(--theme-color) text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "保存中…" : "保存菜品"}
          </Button>
        </form>
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

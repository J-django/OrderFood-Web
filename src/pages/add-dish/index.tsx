import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Page } from "@/components";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { menuCategories, routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useDishStore } from "@/store";
import type { MenuCategory } from "@/types";

const dishCategories = menuCategories.filter(
  (item): item is MenuCategory => item !== "全部",
);

export default function AddDishPage() {
  useDocumentTitle("添加菜品");
  const navigate = useNavigate();
  const addDish = useDishStore((state) => state.addDish);
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MenuCategory | "">("");
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [error, setError] = useState("");

  function chooseImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError("请输入菜名");
      return;
    }
    addDish({
      id: crypto.randomUUID(),
      name: name.trim(),
      category: category || "其他",
      price: 0,
      image: image || "/images/menu/garden-salad.jpg",
      ingredients: "",
      seasonings: "",
      method: description.trim(),
    });
    navigate(routePaths.home);
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
            onClick={() => setCategoryDrawerOpen(true)}
            className="mt-2.5 flex h-10.5 w-full items-center justify-between rounded-xl border-none bg-white px-3 text-left text-sm"
          >
            <span className={category ? "text-[#222]" : "text-[#999]"}>
              {category || "菜品类"}
            </span>
            <span className="icon-[lucide--chevron-right] size-4 text-[#999]" />
          </Button>
          {error && <p className="mt-2 text-xs text-[#e53e20]">{error}</p>}
          <Button
            type="submit"
            className="mt-5 h-10.5 w-full rounded-full bg-[#ff5f15] text-sm font-semibold text-white"
          >
            保存菜品
          </Button>
        </form>
      </Page.Content>
      <Drawer open={categoryDrawerOpen} onOpenChange={setCategoryDrawerOpen}>
        <DrawerContent className="!rounded-b-none bg-white [--drawer-inset:0rem]">
          <div className="px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
            {dishCategories.map((item) => {
              const selected = category === item;
              return (
                <Button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setCategory(item);
                    setCategoryDrawerOpen(false);
                  }}
                  className="flex h-12 w-full items-center justify-between border-b border-[#f0f0f0] text-left text-sm text-[#222] last:border-b-0"
                >
                  <span>{item}</span>
                  {selected && (
                    <span className="icon-[lucide--check] size-5 text-[#ff5f15]" />
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

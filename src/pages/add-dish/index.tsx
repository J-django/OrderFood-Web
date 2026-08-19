import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button, Page } from "@/components";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useDraftStore } from "@/store";

const fieldClassName =
  "mt-2 h-11 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-300 focus:border-stone-400";

export default function AddDishPage() {
  useDocumentTitle("添加菜品");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingDraftId = searchParams.get("draft");
  const editingDraft = useDraftStore((state) =>
    state.drafts.find((draft) => draft.id === editingDraftId),
  );
  const saveDraft = useDraftStore((state) => state.saveDraft);
  const updateDraft = useDraftStore((state) => state.updateDraft);
  const [name, setName] = useState(editingDraft?.name ?? "");
  const [category, setCategory] = useState(editingDraft?.category ?? "主食");
  const [price, setPrice] = useState(
    editingDraft ? String(editingDraft.price) : "",
  );
  const [ingredients, setIngredients] = useState(
    editingDraft?.ingredients ?? "",
  );
  const [seasonings, setSeasonings] = useState(editingDraft?.seasonings ?? "");
  const [method, setMethod] = useState(editingDraft?.method ?? "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericPrice = Number(price);

    if (!name.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      return;
    }

    const draft = {
      name: name.trim(),
      category,
      price: numericPrice,
      ingredients: ingredients.trim(),
      seasonings: seasonings.trim(),
      method: method.trim(),
    };

    if (editingDraftId && editingDraft) {
      updateDraft(editingDraftId, draft);
    } else {
      saveDraft(draft);
    }

    navigate(routePaths.drafts);
  }

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header
        title={editingDraft ? "编辑菜品" : "添加菜品"}
        backTo={editingDraft ? routePaths.drafts : routePaths.profile}
      />
      <Page.Content>
        <form
          onSubmit={handleSubmit}
          className="mt-3 space-y-5 bg-white px-5 py-5"
        >
          <label className="block text-sm font-semibold text-stone-700">
            菜品名称
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="例如：番茄炒蛋"
              className={fieldClassName}
            />
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            分类
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={fieldClassName}
            >
              <option>主食</option>
              <option>小吃</option>
              <option>饮品</option>
              <option>其他</option>
            </select>
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            价格
            <div className="relative">
              <span className="absolute top-1/2 left-3 mt-1 -translate-y-1/2 text-sm text-stone-400">
                ¥
              </span>
              <input
                required
                min="0.01"
                step="0.01"
                inputMode="decimal"
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0.00"
                className={`${fieldClassName} pl-7`}
              />
            </div>
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            食材
            <textarea
              rows={3}
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              placeholder="例如：番茄、鸡蛋、葱"
              className="mt-2 w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm text-stone-900 transition-colors outline-none placeholder:text-stone-300 focus:border-stone-400"
            />
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            配料
            <textarea
              rows={3}
              value={seasonings}
              onChange={(event) => setSeasonings(event.target.value)}
              placeholder="例如：盐、生抽、白糖"
              className="mt-2 w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm text-stone-900 transition-colors outline-none placeholder:text-stone-300 focus:border-stone-400"
            />
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            做法
            <textarea
              rows={5}
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              placeholder="填写菜品的制作步骤"
              className="mt-2 w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm text-stone-900 transition-colors outline-none placeholder:text-stone-300 focus:border-stone-400"
            />
          </label>

          <Button
            type="submit"
            className="h-11 w-full bg-[#ff5a36] text-white hover:bg-[#ed4927]"
          >
            <span className="icon-[lucide--save] size-4" />
            {editingDraft ? "保存修改" : "保存到草稿"}
          </Button>
        </form>
      </Page.Content>
    </Page>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router";
import { Page } from "@/components";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDocumentTitle } from "@/hooks";
import { useDraftStore } from "@/store";
import type { DishDraft } from "@/types";
import { routePaths } from "@/constants";

const categoryImages: Record<string, string> = {
  主食: "/images/menu/chicken-bowl.jpg",
  小吃: "/images/menu/crispy-wings.jpg",
  饮品: "/images/menu/lemon-soda.jpg",
};

function formatDraftTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const pad = (part: number) => String(part).padStart(2, "0");

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
  ].join(" ");
}

function getDraftImage(draft: DishDraft) {
  return categoryImages[draft.category] ?? "/images/menu/garden-salad.jpg";
}

export default function DraftsPage() {
  useDocumentTitle("草稿");
  const navigate = useNavigate();
  const drafts = useDraftStore((state) => state.drafts);
  const removeDraft = useDraftStore((state) => state.removeDraft);
  const [deletingDraftId, setDeletingDraftId] = useState<string | null>(null);

  function handleDelete() {
    if (!deletingDraftId) {
      return;
    }

    removeDraft(deletingDraftId);
    setDeletingDraftId(null);
  }

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Content>
        {drafts.length > 0 ? (
          <section className="space-y-2.5 p-2.5" aria-label="草稿列表">
            {drafts.map((draft) => (
              <article
                key={draft.id}
                className="overflow-hidden rounded-2xl bg-white"
              >
                <header className="flex items-center justify-between gap-3 border-b border-[#eeeeee] p-3 text-sm text-[#555555]">
                  <p className="min-w-0 truncate">
                    草稿 {formatDraftTime(draft.updatedAt)}
                  </p>
                  <div className="flex shrink-0 items-center gap-4 text-[#ff5f15]">
                    <button
                      type="button"
                      onClick={() => navigate(routePaths.editDish(draft.id))}
                      className="py-1"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingDraftId(draft.id)}
                      className="py-1"
                    >
                      删除
                    </button>
                  </div>
                </header>

                <div className="py-2.5">
                  <div className="flex min-w-0 items-start px-3">
                    <img
                      src={getDraftImage(draft)}
                      alt=""
                      className="size-15 shrink-0 rounded-xl bg-stone-100 object-cover"
                    />
                    <div className="ml-2 min-w-0 flex-1 overflow-hidden">
                      <h2 className="mb-1 truncate text-sm leading-5 font-semibold text-[#222222]">
                        {draft.name}
                      </h2>
                      <p className="truncate text-xs leading-4 text-[#777777]">
                        <span className="font-medium text-[#555555]">
                          食材：
                        </span>
                        {draft.ingredients || "暂无"}
                      </p>
                      <p className="mt-0.5 truncate text-xs leading-4 text-[#777777]">
                        <span className="font-medium text-[#555555]">
                          配料：
                        </span>
                        {draft.seasonings || "暂无"}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="pt-32 text-center text-sm text-[#999999]">
            暂无草稿订单
          </div>
        )}
      </Page.Content>

      <AlertDialog
        open={deletingDraftId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingDraftId(null);
          }
        }}
      >
        <AlertDialogContent size="sm" className="gap-5 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>删除草稿</AlertDialogTitle>
            <AlertDialogDescription>确认删除此草稿吗？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[#555555]">
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              type="button"
              onClick={handleDelete}
              className="bg-[#ff5f15] text-white hover:bg-[#e85513]"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}

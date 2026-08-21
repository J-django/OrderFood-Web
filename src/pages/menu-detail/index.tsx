import { motion } from "motion/react";
import { Navigate, useParams } from "react-router";
import { Page } from "@/components";
import { getMenuItem } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useDishStore } from "@/store";

export default function MenuDetailPage() {
  const { itemId } = useParams();
  const userDish = useDishStore((state) =>
    state.dishes.find((dish) => dish.id === itemId),
  );
  const item = userDish ?? getMenuItem(itemId);
  useDocumentTitle(item?.name ?? "菜品详情");

  if (!item) {
    return <Navigate to="/" replace />;
  }

  return (
    <Page className="bg-white">
      <Page.Header title="菜品详情" backTo="/" />
      <Page.Content>
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={item.image}
          alt={item.name}
          className="mx-4 mt-4 aspect-4/3 w-[calc(100%-2rem)] rounded-2xl bg-stone-100 object-cover"
        />
        <div className="px-4 pb-6">
          <section className="pt-5">
            <h2 className="text-xl leading-7 font-semibold text-[#222]">
              {item.name}
            </h2>
          </section>

          <div className="mt-2 space-y-1 text-sm leading-5.5 text-[#777]">
            <p className="text-[#555]">
              <b className="font-semibold">品类：</b>
              {item.category || "暂无"}
            </p>
            <p className="text-[#555]">
              <b className="font-semibold">食材：</b>
              {item.ingredients || "暂无"}
            </p>
            <p className="text-[#555]">
              <b className="font-semibold">配料：</b>
              {item.seasonings || "暂无"}
            </p>
            <div className="flex items-start">
              <p className="shrink-0 font-semibold text-[#555]">做法：</p>
              <p className="min-w-0 flex-1 whitespace-pre-wrap text-[#555]">
                {item.method || "暂无"}
              </p>
            </div>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
}

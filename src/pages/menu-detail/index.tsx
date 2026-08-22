import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { dishToMenuItem } from "@/api/endpoints/adapters";
import { getDish } from "@/api/endpoints/menu";
import { Page } from "@/components";
import { Image } from "@/components/image";
import { getMenuItem } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import type { MenuItem } from "@/types";

export default function MenuDetailPage() {
  const { itemId } = useParams();
  const [dish, setDish] = useState<MenuItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  useDocumentTitle(dish?.name ?? "菜品详情");

  useEffect(() => {
    if (!itemId) return;
    let cancelled = false;
    getDish(itemId)
      .then((result) => {
        if (!cancelled) setDish(dishToMenuItem(result));
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = getMenuItem(itemId);
        if (fallback) {
          setDish(fallback);
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
      <Page.Header title="菜品详情" backTo="/" />
      <Page.Content>
        <Image
          src={dish.image}
          alt={dish.name}
          classes={{
            container:
              "mx-4 mt-4 aspect-4/3 w-[calc(100%-2rem)] rounded-2xl bg-stone-100",
            image: "object-cover",
          }}
        />
        <div className="px-4 pb-6">
          <section className="pt-5">
            <h2 className="text-xl leading-7 font-semibold text-[#222]">
              {dish.name}
            </h2>
          </section>

          <div className="mt-2 space-y-1 text-sm leading-5.5 text-[#777]">
            <p className="text-[#555]">
              <b className="font-semibold">品类：</b>
              {dish.category || "暂无"}
            </p>
            <p className="text-[#555]">
              <b className="font-semibold">食材：</b>
              {dish.ingredients || "暂无"}
            </p>
            <p className="text-[#555]">
              <b className="font-semibold">配料：</b>
              {dish.seasonings || "暂无"}
            </p>
            <div className="flex items-start">
              <p className="shrink-0 font-semibold text-[#555]">做法：</p>
              <p className="min-w-0 flex-1 whitespace-pre-wrap text-[#555]">
                {dish.method || "暂无"}
              </p>
            </div>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
}

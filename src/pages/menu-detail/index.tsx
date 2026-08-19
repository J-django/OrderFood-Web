import { motion } from "motion/react";
import { Navigate, useParams } from "react-router";
import { Page } from "@/components";
import { getMenuItem } from "@/constants";
import { useDocumentTitle } from "@/hooks";

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <section className="border-b border-stone-100 py-5 last:border-b-0">
      <h2 className="text-sm font-bold text-stone-900">{title}</h2>
      <div className="mt-2 text-sm leading-6 text-stone-600">{children}</div>
    </section>
  );
}

export default function MenuDetailPage() {
  const { itemId } = useParams();
  const item = getMenuItem(itemId);
  useDocumentTitle(item?.name ?? "菜品详情");

  if (!item) {
    return <Navigate to="/" replace />;
  }

  return (
    <Page>
      <Page.Header title="菜品详情" backTo="/" />
      <Page.Content>
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={item.image}
          alt={item.name}
          className="aspect-[4/3] w-full bg-stone-100 object-cover"
        />
        <div className="px-5 pb-6">
          <section className="border-b border-stone-100 py-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold text-stone-900">{item.name}</h2>
              <span className="shrink-0 rounded bg-[#fff0d8] px-2 py-1 text-xs font-medium text-[#a75b16]">
                {item.category}
              </span>
            </div>
          </section>

          <InfoSection title="食材">
            <p>{item.ingredients}</p>
          </InfoSection>
          <InfoSection title="配料">
            <p>{item.seasonings}</p>
          </InfoSection>
          <InfoSection title="做法">
            <p>{item.method}</p>
          </InfoSection>
        </div>
      </Page.Content>
    </Page>
  );
}

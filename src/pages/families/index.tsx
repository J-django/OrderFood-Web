import { Link } from "react-router";
import { Page } from "@/components";
import { useDocumentTitle } from "@/hooks";

const families = [
  {
    id: "warm-home",
    name: "温馨小家",
    members: ["爸爸", "妈妈", "小明"],
    description: "今天也要好好吃饭",
  },
  {
    id: "weekend-kitchen",
    name: "周末厨房",
    members: ["小明", "阿杰"],
    description: "周末聚餐菜谱",
  },
];

export default function FamiliesPage() {
  useDocumentTitle("我的家庭");

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header title="我的家庭" backTo="/profile" />
      <Page.Content>
        <section className="mt-3 bg-white px-5" aria-label="家庭列表">
          {families.map((family) => (
            <Link
              key={family.id}
              to={`/profile/families/${family.id}`}
              className="flex items-center gap-3 border-b border-stone-100 py-4 last:border-b-0"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#e6f3e8] text-[#27824b]">
                <span className="icon-[lucide--house-heart] size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-bold text-stone-900">
                  {family.name}
                </h2>
                <p className="mt-1 truncate text-xs text-stone-500">
                  {family.description} · {family.members.length} 位成员
                </p>
              </div>
              <span className="icon-[lucide--chevron-right] size-4 text-stone-300" />
            </Link>
          ))}
        </section>
      </Page.Content>
    </Page>
  );
}

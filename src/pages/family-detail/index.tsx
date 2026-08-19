import { Navigate, useParams } from "react-router";
import { Page } from "@/components";
import { useDocumentTitle } from "@/hooks";

const familyDetails = {
  "warm-home": {
    name: "温馨小家",
    description: "今天也要好好吃饭",
    members: [
      { name: "爸爸", role: "管理员", color: "#e8f1fb" },
      { name: "妈妈", role: "成员", color: "#fff0d8" },
      { name: "小明", role: "成员", color: "#e6f3e8" },
    ],
  },
  "weekend-kitchen": {
    name: "周末厨房",
    description: "周末聚餐菜谱",
    members: [
      { name: "小明", role: "管理员", color: "#e6f3e8" },
      { name: "阿杰", role: "成员", color: "#f4e9f8" },
    ],
  },
} as const;

export default function FamilyDetailPage() {
  const { familyId } = useParams();
  const family = familyDetails[familyId as keyof typeof familyDetails];
  useDocumentTitle(family?.name ?? "家庭详情");

  if (!family) {
    return <Navigate to="/profile/families" replace />;
  }

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header title="家庭详情" backTo="/profile/families" />
      <Page.Content>
        <section className="px-5 py-6 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-lg bg-[#e6f3e8] text-[#27824b]">
            <span className="icon-[lucide--house-heart] size-7" />
          </div>
          <h2 className="mt-3 text-xl font-bold text-stone-900">
            {family.name}
          </h2>
          <p className="mt-1 text-sm text-stone-500">{family.description}</p>
        </section>

        <section className="bg-white px-5" aria-label="家庭成员">
          <h2 className="border-b border-stone-100 py-4 text-sm font-bold text-stone-900">
            家庭成员 · {family.members.length}
          </h2>
          {family.members.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-3 border-b border-stone-100 py-4 last:border-b-0"
            >
              <div
                className="grid size-10 place-items-center rounded-full text-sm font-bold text-stone-700"
                style={{ backgroundColor: member.color }}
              >
                {member.name.slice(0, 1)}
              </div>
              <span className="flex-1 text-sm font-semibold text-stone-900">
                {member.name}
              </span>
              <span className="text-xs text-stone-400">{member.role}</span>
            </div>
          ))}
        </section>
      </Page.Content>
    </Page>
  );
}

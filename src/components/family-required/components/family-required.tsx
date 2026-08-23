import { useNavigate } from "react-router";
import { routePaths } from "@/constants";

function FamilyRequired() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-[calc(100dvh-var(--layout-bottom-offset))] place-items-center bg-white px-8 text-center">
      <div>
        <span className="icon-[lucide--users-round] mx-auto block size-7 text-[#b8b8b8]" />
        <p className="mt-3 text-sm text-[#999]">请先创建家庭</p>
        <button
          type="button"
          onClick={() => navigate(routePaths.families)}
          className="mt-4 h-9 rounded-full bg-(--theme-color) px-5 text-sm font-semibold text-white"
        >
          去选择家庭
        </button>
      </div>
    </div>
  );
}

export { FamilyRequired };

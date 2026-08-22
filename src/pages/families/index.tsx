import { useEffect, useState } from "react";
import { Link } from "react-router";
import { createFamily, getFamilies, setDefaultFamily } from "@/api/endpoints/families";
import { Dialog, Page } from "@/components";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useFamilyStore, useUserStore } from "@/store";
import type { ApiFamily } from "@/types";

export default function FamiliesPage() {
  useDocumentTitle("我的家庭");
  const user = useUserStore((state) => state.user);
  const families = useFamilyStore((state) => state.families);
  const setFamilies = useFamilyStore((state) => state.setFamilies);
  const upsertFamily = useFamilyStore((state) => state.upsertFamily);
  const currentFamilyId = useFamilyStore((state) => state.currentFamilyId);
  const setCurrentFamily = useFamilyStore((state) => state.setCurrentFamily);

  const [loadingFamilyId, setLoadingFamilyId] = useState<string | null>(null);
  const loading = loadingFamilyId !== "loaded";
  const [defaultFamilyId, setDefaultFamilyId] = useState<string | null>(
    () => useUserStore.getState().user?.defaultFamilyId ?? null,
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getFamilies()
      .then((result) => {
        if (!cancelled) setFamilies(result.items ?? []);
      })
      .catch(() => {
        /* 全局错误提示已处理 */
      })
      .finally(() => {
        if (!cancelled) setLoadingFamilyId("loaded");
      });
    return () => {
      cancelled = true;
    };
  }, [setFamilies]);

  function handleSelectDefault(family: ApiFamily) {
    if (family.id === defaultFamilyId) return;
    const previous = defaultFamilyId;
    setDefaultFamilyId(family.id);
    setCurrentFamily(family.id);
    setDefaultFamilyRequest(family).catch(() => {
      setDefaultFamilyId(previous);
    });
  }

  async function setDefaultFamilyRequest(family: ApiFamily) {
    await setDefaultFamily(family.id);
  }

  async function handleConfirmAdd() {
    const trimmedName = familyName.trim();
    if (!trimmedName || creating) return;
    setCreating(true);
    try {
      const family = await createFamily({
        name: trimmedName,
      });
      upsertFamily(family);
      setFamilyName("");
      setShowAddDialog(false);
      if (!currentFamilyId) setCurrentFamily(family.id);
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setCreating(false);
    }
  }

  function familyCreator(family: ApiFamily) {
    if (family.owner?.name) return family.owner.name;
    if (family.ownerId === user?.id) return "我";
    return "家庭成员";
  }

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header
        title="我的家庭"
        backTo={routePaths.profile}
        trailing={
          <button
            type="button"
            aria-label="添加家庭"
            onClick={() => setShowAddDialog(true)}
            className="hover:bg-muted-foreground/15 active:bg-muted-foreground/15 grid size-10 place-items-center rounded-full text-stone-700 transition-colors select-none"
          >
            <span className="icon-[tabler--plus] size-6" />
          </button>
        }
      />
      <Page.Content>
        <section className="flex flex-col gap-2.5 p-3" aria-label="家庭列表">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#999]">
              加载中…
            </div>
          ) : families.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#999]">
              还没有家庭，点击右上角创建
            </div>
          ) : (
            families.map((family) => (
              <Link
                key={family.id}
                to={routePaths.familyDetail(family.id)}
                className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5"
                aria-label={`家庭 ${family.name}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="truncate text-base font-semibold text-stone-900">
                      {family.name}
                    </h2>
                    <span className="icon-[lucide--chevron-right] -mr-0.75 size-5 shrink-0 text-stone-300" />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[13px] text-stone-500">
                      创建人 {familyCreator(family)}
                    </p>
                    <label
                      className="relative z-10 flex items-center gap-2 text-[13px] text-stone-600 before:absolute before:-inset-2 before:content-['']"
                      onClick={(event) => {
                        event.preventDefault();
                        handleSelectDefault(family);
                      }}
                    >
                      设为默认
                      <RadioGroup
                        value={defaultFamilyId ?? ""}
                        onValueChange={() => handleSelectDefault(family)}
                        className="w-auto gap-0"
                      >
                        <RadioGroupItem value={family.id} />
                      </RadioGroup>
                    </label>
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
      </Page.Content>

      <Dialog
        open={showAddDialog}
        title="添加家庭"
        showCancel
        confirmText={creating ? "创建中…" : "添加"}
        maskClosable={false}
        classes={{
          content: "px-2.5 pt-2.5 pb-0.5",
          confirmButton: "bg-(--theme-color)/10 text-(--theme-color)",
        }}
        onConfirm={() => void handleConfirmAdd()}
        onCancel={() => setShowAddDialog(false)}
        onClose={() => {
          setFamilyName("");
          setShowAddDialog(false);
        }}
      >
        <InputGroup className="h-10 rounded-full border-0 bg-[#f3f3f3] shadow-none">
          <InputGroupInput
            value={familyName}
            onChange={(event) => setFamilyName(event.target.value)}
            placeholder="请输入家庭名称"
            aria-label="家庭名称"
            maxLength={20}
            className="text-md h-auto bg-transparent pl-3.5 text-center text-[#333] placeholder:text-[#aaa]"
          />
        </InputGroup>
      </Dialog>
    </Page>
  );
}

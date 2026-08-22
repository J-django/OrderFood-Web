import { useCallback, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import {
  confirmFamilyInvitation,
  searchFamilyInvitation,
} from "@/api/endpoints/families";
import { Dialog, Page } from "@/components";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useFamilyStore, useUserStore } from "@/store";

export default function FamilyDetailPage() {
  const { familyId } = useParams();
  const family = useFamilyStore((state) =>
    state.families.find((item) => item.id === familyId),
  );
  const upsertFamily = useFamilyStore((state) => state.upsertFamily);
  const user = useUserStore((state) => state.user);
  useDocumentTitle(family?.name ?? "家庭详情");

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [phone, setPhone] = useState("");
  const [searching, setSearching] = useState(false);
  const [pendingUser, setPendingUser] = useState<{
    id?: string;
    name?: string | null;
    phone?: string | null;
  } | null>(null);

  const refreshFamily = useCallback(async () => {
    if (!family) return;
    // 家庭信息以本地缓存 + 列表刷新为准；此处仅回写 owner 展示
    if (family.owner) upsertFamily(family);
  }, [family, upsertFamily]);

  useEffect(() => {
    void refreshFamily();
  }, [refreshFamily]);

  if (!family) {
    return <Navigate to={routePaths.families} replace />;
  }

  async function handleSearchMember() {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone || searching) return;
    setSearching(true);
    try {
      const result = await searchFamilyInvitation({ phone: trimmedPhone });
      if (!result.user) {
        toast.add({
          type: "error",
          title: "未找到用户",
          description: "该手机号尚未注册",
        });
        return;
      }
      setPendingUser(result.user);
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setSearching(false);
    }
  }

  async function handleInviteMember() {
    const target = pendingUser ?? { phone };
    if (!target.phone || !family) return;
    try {
      await confirmFamilyInvitation({ phone: target.phone });
      toast.add({ type: "success", title: "已发送家庭邀请" });
      setShowAddDialog(false);
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setPendingUser(null);
      setPhone("");
    }
  }

  const isOwner = family.ownerId === user?.id;
  const ownerName =
    family.owner?.name || (isOwner ? "我" : "家庭创建者");

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header title={family.name} backTo={routePaths.families} />
      <Page.Content>
        <section className="bg-white px-3" aria-label="家庭成员">
          <h2 className="border-b border-stone-100 py-4 text-sm font-bold text-stone-900">
            家庭成员
          </h2>
          <div className="flex items-center gap-3 border-b border-stone-100 py-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-(--theme-color-soft) text-sm font-bold text-(--theme-color)">
              {ownerName.slice(0, 1)}
            </div>
            <span className="flex-1 text-sm font-semibold text-stone-900">
              {ownerName}
            </span>
            <span className="text-[13px] text-stone-400">管理员</span>
          </div>
          {isOwner && (
            <button
              type="button"
              onClick={() => setShowAddDialog(true)}
              className="flex h-12 w-full items-center justify-center gap-1 text-sm font-semibold text-(--theme-color)"
            >
              <span className="icon-[tabler--plus] size-4" />
              邀请成员
            </button>
          )}
        </section>

        <p className="px-4 pt-3 text-xs leading-5 text-stone-400">
          创建于 {new Date(family.createdAt).toLocaleDateString()}。
          {isOwner
            ? "作为创建者，你可以通过手机号邀请成员加入。"
            : "仅家庭创建者可以邀请新成员。"}
        </p>
      </Page.Content>

      <Dialog
        open={showAddDialog}
        title={pendingUser ? "确认邀请" : "添加成员"}
        showCancel
        confirmText={pendingUser ? "确认邀请" : searching ? "查找中…" : "查找"}
        maskClosable={false}
        classes={{
          content: "px-2.5 pt-2.5 pb-0.5",
          confirmButton: "bg-(--theme-color)/10 text-(--theme-color)",
        }}
        onConfirm={() => {
          if (pendingUser) {
            void handleInviteMember();
          } else {
            void handleSearchMember();
          }
        }}
        onCancel={() => {
          setPendingUser(null);
          setPhone("");
          setShowAddDialog(false);
        }}
        onClose={() => {
          setPendingUser(null);
          setPhone("");
          setShowAddDialog(false);
        }}
      >
        {pendingUser ? (
          <div className="py-3 text-center">
            <p className="text-sm text-[#333]">
              {pendingUser.name || pendingUser.phone}
            </p>
            <p className="mt-1 text-xs text-[#999]">
              确认邀请 {pendingUser.phone} 加入「{family.name}」？
            </p>
          </div>
        ) : (
          <InputGroup className="h-10 rounded-full border-0 bg-[#f3f3f3] shadow-none">
            <InputGroupInput
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setPendingUser(null);
              }}
              placeholder="请输入手机号"
              aria-label="成员手机号"
              maxLength={11}
              className="text-md h-auto bg-transparent pl-3.5 text-center text-[#333] placeholder:text-[#aaa]"
            />
          </InputGroup>
        )}
      </Dialog>
    </Page>
  );
}

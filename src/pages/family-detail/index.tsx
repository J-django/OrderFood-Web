import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import {
  confirmFamilyInvitation,
  getFamily,
  removeFamilyMember,
  searchFamilyInvitation,
} from "@/api/endpoints/families";
import { Dialog, Page } from "@/components";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useFamilyStore, useUserStore } from "@/store";
import type { ApiFamilyDetail } from "@/types";

export default function FamilyDetailPage() {
  const { familyId } = useParams();
  const cachedFamily = useFamilyStore((state) =>
    state.families.find((item) => item.id === familyId),
  );
  const upsertFamily = useFamilyStore((state) => state.upsertFamily);
  const user = useUserStore((state) => state.user);
  const [family, setFamily] = useState<ApiFamilyDetail | null>(null);
  useDocumentTitle(family?.name ?? cachedFamily?.name ?? "家庭详情");

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [phone, setPhone] = useState("");
  const [searching, setSearching] = useState(false);
  const [familyLoading, setFamilyLoading] = useState(() => Boolean(familyId));
  const [editingMembers, setEditingMembers] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [removingMember, setRemovingMember] = useState(false);
  const [pendingUser, setPendingUser] = useState<{
    id?: string;
    name?: string | null;
    phone?: string | null;
  } | null>(null);

  useEffect(() => {
    if (!familyId) return;
    let cancelled = false;
    getFamily(familyId)
      .then((result) => {
        if (cancelled) return;
        setFamily(result);
        upsertFamily(result);
      })
      .catch(() => {
        /* 全局错误提示已处理 */
      })
      .finally(() => {
        if (!cancelled) setFamilyLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [familyId, upsertFamily]);

  if (familyLoading) {
    return (
      <Page className="bg-[#f8f8f8]">
        <Page.Header title="家庭详情" backTo={routePaths.families} />
        <Page.Content>
          <div className="py-16 text-center text-sm text-[#999]">加载中…</div>
        </Page.Content>
      </Page>
    );
  }

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
          title: "该手机号尚未注册",
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
      const latestFamily = await getFamily(family.id);
      setFamily(latestFamily);
      upsertFamily(latestFamily);
      toast.add({ type: "success", title: "已发送家庭邀请" });
      setShowAddDialog(false);
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setPendingUser(null);
      setPhone("");
    }
  }

  async function handleRemoveMember() {
    if (!familyId || !removingMemberId || removingMember) return;
    setRemovingMember(true);
    try {
      await removeFamilyMember(familyId, removingMemberId);
      const latestFamily = await getFamily(familyId);
      setFamily(latestFamily);
      upsertFamily(latestFamily);
      setRemovingMemberId(null);
      toast.add({ type: "success", title: "成员已移除" });
    } catch {
      /* 全局错误提示已处理 */
    } finally {
      setRemovingMember(false);
    }
  }

  const isOwner = family.ownerId === user?.id;

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header
        title={family.name}
        backTo={routePaths.families}
        trailing={
          isOwner && family.members.length > 1 ? (
            <button
              type="button"
              aria-label={editingMembers ? "完成编辑成员" : "编辑成员"}
              onClick={() => setEditingMembers((editing) => !editing)}
              className={`hover:bg-muted-foreground/15 active:bg-muted-foreground/15 grid size-10 place-items-center rounded-full text-stone-700 transition-colors select-none ${editingMembers ? "bg-muted-foreground/15" : ""}`}
            >
              <span
                className={`${editingMembers ? "icon-[fa7-solid--close]" : "icon-[tabler--pencil]"} size-5.5`}
              />
            </button>
          ) : null
        }
      />
      <Page.Content>
        <section className="bg-white px-3" aria-label="家庭成员">
          <h2 className="flex items-center justify-between border-b border-stone-100 py-4 text-sm font-bold text-stone-900">
            <span>家庭成员</span>
            <span className="font-normal text-stone-400">
              {family.members.length}人
            </span>
          </h2>
          {family.members.map((member) => {
            const isMemberOwner = member.id === family.ownerId;
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 border-b border-stone-100 py-3"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-(--theme-color-soft) text-sm font-bold text-(--theme-color)">
                  {member.name.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-stone-900">
                    {member.name || "未命名用户"}
                  </span>
                  <span className="block text-xs text-stone-400">
                    {member.phone}
                  </span>
                </div>
                {isMemberOwner ? (
                  <span className="text-[13px] text-stone-400">管理员</span>
                ) : (
                  <AnimatePresence initial={false}>
                    {editingMembers && (
                      <motion.button
                        type="button"
                        aria-label={`移除${member.name}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                        onClick={() => setRemovingMemberId(member.id)}
                        className="grid size-5.5 shrink-0 place-items-center rounded-full bg-(--lc-red) text-white"
                      >
                        <span className="icon-[tabler--minus] size-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
          {isOwner && (
            <button
              type="button"
              onClick={() => setShowAddDialog(true)}
              className="flex h-9.5 w-full items-center justify-center gap-1 text-[13px] font-semibold text-(--theme-color)"
            >
              <span className="icon-[tabler--plus] size-4" />
              邀请成员
            </button>
          )}
        </section>
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
          <InputGroup className="h-10 rounded-full border-0 bg-[#f8f8f8] shadow-none">
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
      <Dialog
        open={Boolean(removingMemberId)}
        title="移除家庭成员"
        content="确认移除此成员吗？"
        showCancel
        confirmText={removingMember ? "移除中…" : "移除"}
        maskClosable={false}
        classes={{ confirmButton: "bg-(--lc-red) text-white" }}
        onConfirm={() => void handleRemoveMember()}
        onCancel={() => setRemovingMemberId(null)}
        onClose={() => setRemovingMemberId(null)}
      />
    </Page>
  );
}

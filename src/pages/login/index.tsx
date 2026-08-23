import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { Page } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage, login } from "@/api";
import { toast } from "@/components/ui/toast";
import { routePaths } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { useFamilyStore, useUserStore } from "@/store";

export default function LoginPage() {
  useDocumentTitle("登录");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = useUserStore((state) => state.accessToken);
  const setLoginResult = useUserStore((state) => state.setLoginResult);
  const setFamilies = useFamilyStore((state) => state.setFamilies);
  const setCurrentFamily = useFamilyStore((state) => state.setCurrentFamily);

  const [phone, setPhone] = useState(
    () => localStorage.getItem("order-food-last-phone") ?? "",
  );
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (accessToken) {
    return <Navigate to={searchParams.get("redirect") || "/"} replace />;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedPhone = phone.trim();
    const trimmedName = name.trim();
    if (!/^\d{11}$/.test(trimmedPhone)) {
      toast.add({ type: "error", title: "请输入11位手机号" });
      return;
    }
    if (!trimmedName) {
      toast.add({ type: "error", title: "请输入姓名" });
      return;
    }
    if (trimmedName.length > 100) {
      toast.add({ type: "error", title: "姓名不能超过100个字符" });
      return;
    }
    if (!password) {
      toast.add({ type: "error", title: "请输入密码" });
      return;
    }
    if (password.length > 128) {
      toast.add({ type: "error", title: "密码不能超过128个字符" });
      return;
    }
    setSubmitting(true);
    try {
      const result = await login({
        phone: trimmedPhone,
        name: trimmedName,
        password,
      });
      localStorage.setItem("order-food-last-phone", trimmedPhone);
      setLoginResult(result);
      setFamilies(result.families ?? []);
      setCurrentFamily(
        result.user.defaultFamilyId ?? result.families?.[0]?.id ?? null,
      );
      navigate(searchParams.get("redirect") || routePaths.home, {
        replace: true,
      });
    } catch (requestError) {
      toast.add({
        type: "error",
        title: getApiErrorMessage(requestError) ?? "登录失败，请稍后重试",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Page className="bg-white">
      <Page.Content>
        <form
          onSubmit={submit}
          className="mx-auto flex w-full max-w-80 flex-col pt-[calc(env(safe-area-inset-top)+6rem)]"
        >
          <div className="grid size-16 place-items-center self-center rounded-3xl bg-(--theme-color-soft) text-(--theme-color)">
            <span className="icon-[lucide--utensils] size-8" />
          </div>
          <h1 className="mt-4 text-center text-xl font-semibold text-[#222]">
            欢迎来到点餐
          </h1>
          <p className="mt-1 text-center text-sm text-[#999]">
            登录后与家人一起点菜
          </p>

          <Input
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
            }}
            type="tel"
            placeholder="手机号"
            aria-label="手机号"
            inputMode="numeric"
            maxLength={11}
            className="mt-10 h-11 w-full rounded-full border-none bg-[#f5f5f5] px-4 text-sm outline-none placeholder:text-[#aaa]"
          />
          <Input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            placeholder="姓名"
            aria-label="姓名"
            maxLength={100}
            className="mt-2.5 h-11 w-full rounded-full border-none bg-[#f5f5f5] px-4 text-sm outline-none placeholder:text-[#aaa]"
          />
          <Input
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            type="password"
            placeholder="密码"
            aria-label="密码"
            maxLength={128}
            className="mt-2.5 h-11 w-full rounded-full border-none bg-[#f5f5f5] px-4 text-sm outline-none placeholder:text-[#aaa]"
          />
          <Button
            type="submit"
            disabled={submitting}
            disablePressMotion={true}
            className="mt-8 h-11 w-full rounded-full bg-(--theme-color) text-base font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "登录中…" : "登录"}
          </Button>
        </form>
      </Page.Content>
    </Page>
  );
}

import axios from "axios";
import { toast } from "@/components/ui/toast";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readMessageValue(value: unknown) {
  if (typeof value === "string") return value;
  if (Array.isArray(value))
    return value
      .filter((item): item is string => typeof item === "string")
      .join(", ");
  return undefined;
}

function readResponseMessage(data: unknown) {
  if (!isRecord(data)) return undefined;
  return readMessageValue(data.message) ?? readMessageValue(data.error);
}

export function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return undefined;
  return readResponseMessage(error.response?.data);
}

function getStatusMessage(status: number | undefined) {
  if (status === 400) return "请求参数错误";
  if (status === 401) return "登录状态已失效";
  if (status === 403) return "没有权限执行此操作";
  if (status === 404) return "请求资源不存在";
  if (status && status >= 500) return "服务器暂时不可用";
  return "请求失败";
}

export function showApiErrorToast(error: unknown) {
  if (axios.isCancel(error)) return;

  if (!axios.isAxiosError(error)) {
    toast.add({ type: "error", title: "发生未知错误" });
    return;
  }

  if (error.config?.skipGlobalErrorToast) return;

  const status = error.response?.status;
  const message =
    readResponseMessage(error.response?.data) ??
    (status ? getStatusMessage(status) : "网络连接失败");
  toast.add({ type: "error", title: message });
}

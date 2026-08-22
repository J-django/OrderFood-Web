import { del, get, patch, post } from "@/api/modules/methods";
import { asArray } from "@/api/endpoints/adapters";
import type { ApiMemo } from "@/types";

export function getMemos() {
  return get<{ items: ApiMemo[] }>("/memos").then((result) => ({
    items: asArray<ApiMemo>(result?.items),
  }));
}

export function createMemo(payload: { name: string; content: string }) {
  return post<ApiMemo, typeof payload>("/memos", { data: payload });
}

export function updateMemo(
  memoId: string,
  payload: Partial<Pick<ApiMemo, "name" | "content">>,
) {
  return patch<ApiMemo, typeof payload>(`/memos/${memoId}`, { data: payload });
}

export function deleteMemo(memoId: string) {
  return del<{ deleted: true }>(`/memos/${memoId}`);
}

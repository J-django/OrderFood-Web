import { post } from "@/api/modules/methods";
import { asArray } from "@/api/endpoints/adapters";
import type { ApiMemo } from "@/types";

export function getMemos() {
  return post<{ items: ApiMemo[] }>("/getMemos").then((result) => ({
    items: asArray<ApiMemo>(result?.items),
  }));
}

export function createMemo(payload: { name: string; content: string }) {
  return post<ApiMemo, typeof payload>("/addMemo", { data: payload });
}

export function updateMemo(
  memoId: string,
  payload: Partial<Pick<ApiMemo, "name" | "content">>,
) {
  return post<ApiMemo, typeof payload & { memoId: string }>("/modifyMemo", {
    data: { memoId, ...payload },
  });
}

export function deleteMemo(memoId: string) {
  return post<{ deleted: true }, { memoId: string }>("/removeMemo", {
    data: { memoId },
  });
}

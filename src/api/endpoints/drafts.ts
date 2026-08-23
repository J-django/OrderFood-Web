import { post } from "@/api/modules/methods";
import { asArray } from "@/api/endpoints/adapters";
import type {
  ApiDraft,
  CreateDraftPayload,
  DeleteDraftResult,
  UpdateDraftPayload,
} from "@/types";

export function getDrafts() {
  return post<{ items: ApiDraft[] }>("/getDrafts").then((result) => ({
    items: asArray<ApiDraft>(result?.items),
  }));
}

export function createDraft(payload: CreateDraftPayload) {
  return post<ApiDraft, CreateDraftPayload>("/addDraft", { data: payload });
}

export function updateDraft(draftId: string, payload: UpdateDraftPayload) {
  return post<ApiDraft, UpdateDraftPayload & { draftId: string }>(
    "/modifyDraft",
    {
      data: { draftId, ...payload },
    },
  );
}

export function deleteDraft(draftId: string) {
  return post<DeleteDraftResult, { draftId: string }>("/removeDraft", {
    data: { draftId },
  });
}

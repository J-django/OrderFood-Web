import { del, get, patch, post } from "@/api/modules/methods";
import { asArray } from "@/api/endpoints/adapters";
import type {
  ApiDraft,
  CreateDraftPayload,
  DeleteDraftResult,
  UpdateDraftPayload,
} from "@/types";

export function getDrafts() {
  return get<{ items: ApiDraft[] }>("/drafts").then((result) => ({
    items: asArray<ApiDraft>(result?.items),
  }));
}

export function createDraft(payload: CreateDraftPayload) {
  return post<ApiDraft, CreateDraftPayload>("/drafts", { data: payload });
}

export function updateDraft(draftId: string, payload: UpdateDraftPayload) {
  return patch<ApiDraft, UpdateDraftPayload>(`/drafts/${draftId}`, {
    data: payload,
  });
}

export function deleteDraft(draftId: string) {
  return del<DeleteDraftResult>(`/drafts/${draftId}`);
}

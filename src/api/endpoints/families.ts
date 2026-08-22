import { del, get, patch, post } from "@/api/modules/methods";
import { asArray } from "@/api/endpoints/adapters";
import type {
  ApiFamily,
  ApiFamilyDetail,
  ConfirmInvitationPayload,
  ConfirmInvitationResult,
  CreateFamilyPayload,
  JoinFamilyPayload,
  JoinFamilyResult,
  SearchInvitationPayload,
  SearchInvitationResult,
  SearchJoinFamiliesPayload,
  SearchJoinFamiliesResult,
  SetDefaultFamilyResult,
} from "@/types";

export function getFamilies() {
  return get<{ items: ApiFamily[] }>("/families").then((result) => ({
    items: asArray<ApiFamily>(result?.items),
  }));
}

export function getFamily(familyId: string) {
  return get<ApiFamilyDetail>(`/families/${familyId}`);
}

export function removeFamilyMember(familyId: string, memberId: string) {
  return del<{ deleted: true }>(
    `/families/${familyId}/members/${memberId}`,
  );
}

export function createFamily(payload: CreateFamilyPayload) {
  return post<ApiFamily, CreateFamilyPayload>("/families", { data: payload });
}

export function searchFamilyInvitation(payload: SearchInvitationPayload) {
  return post<SearchInvitationResult, SearchInvitationPayload>(
    "/families/invitations/search",
    { data: payload },
  );
}

export function confirmFamilyInvitation(payload: ConfirmInvitationPayload) {
  return post<ConfirmInvitationResult, ConfirmInvitationPayload>(
    "/families/invitations/confirm",
    { data: payload },
  );
}

export function searchJoinableFamilies(payload: SearchJoinFamiliesPayload) {
  return post<SearchJoinFamiliesResult, SearchJoinFamiliesPayload>(
    "/families/join/search",
    { data: payload },
  ).then((result) => ({
    items: asArray<SearchJoinFamiliesResult["items"][number]>(result?.items),
  }));
}

export function joinFamily(payload: JoinFamilyPayload) {
  return post<JoinFamilyResult, JoinFamilyPayload>("/families/join", {
    data: payload,
  });
}

export function setDefaultFamily(familyId: string) {
  return patch<SetDefaultFamilyResult>(`/families/${familyId}/default`);
}

import { del, post } from "@/api/modules/methods";
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
  return post<{ items: ApiFamily[] }>("/getFamilies").then((result) => ({
    items: asArray<ApiFamily>(result?.items),
  }));
}

export function getFamily(familyId: string) {
  return post<ApiFamilyDetail, { familyId: string }>("/getFamily", {
    data: { familyId },
  });
}

export function removeFamilyMember(familyId: string, memberId: string) {
  return del<{ deleted: true }>(`/families/${familyId}/members/${memberId}`);
}

export function createFamily(payload: CreateFamilyPayload) {
  return post<ApiFamily, CreateFamilyPayload>("/addFamily", { data: payload });
}

export function searchFamilyInvitation(payload: SearchInvitationPayload) {
  return post<SearchInvitationResult, SearchInvitationPayload>(
    "/searchFamilyInvitation",
    { data: payload },
  );
}

export function confirmFamilyInvitation(payload: ConfirmInvitationPayload) {
  return post<ConfirmInvitationResult, ConfirmInvitationPayload>(
    "/confirmFamilyInvitation",
    { data: payload },
  );
}

export function searchJoinableFamilies(payload: SearchJoinFamiliesPayload) {
  return post<SearchJoinFamiliesResult, SearchJoinFamiliesPayload>(
    "/searchJoinableFamilies",
    { data: payload },
  ).then((result) => ({
    items: asArray<SearchJoinFamiliesResult["items"][number]>(result?.items),
  }));
}

export function joinFamily(payload: JoinFamilyPayload) {
  return post<JoinFamilyResult, JoinFamilyPayload>("/joinFamily", {
    data: payload,
  });
}

export function setDefaultFamily(familyId: string) {
  return post<SetDefaultFamilyResult, { familyId: string }>(
    "/setDefaultFamily",
    { data: { familyId } },
  );
}

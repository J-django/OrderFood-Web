import { post } from "@/api/modules/methods";
import type { MeResult } from "@/types";

export function getMe() {
  return post<MeResult>("/getMe", { skipFamilyId: true });
}

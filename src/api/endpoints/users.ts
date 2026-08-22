import { get } from "@/api/modules/methods";
import type { MeResult } from "@/types";

export function getMe() {
  return get<MeResult>("/me");
}

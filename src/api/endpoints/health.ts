import { post } from "@/api/modules/methods";

export interface ApiHealthResult {
  status: "ok";
  service: "order-food-gateway";
  timestamp: string;
}

export function getHealth() {
  return post<ApiHealthResult>("/getHealth", {
    skipAuth: true,
    skipGlobalErrorToast: true,
  });
}

import { post } from "@/api/modules/methods";
import type {
  ApiLogoutPayload,
  ApiLogoutResult,
  ApiRefreshTokenPayload,
  ApiTokenPair,
  LoginPayload,
  LoginResult,
} from "@/types";

export function login(payload: LoginPayload) {
  return post<LoginResult, LoginPayload>("/auth/login", {
    data: payload,
    skipAuth: true,
  });
}

export function refreshAuthTokens(payload: ApiRefreshTokenPayload) {
  return post<ApiTokenPair, ApiRefreshTokenPayload>("/auth/refresh", {
    data: payload,
    skipAuth: true,
    skipGlobalErrorToast: true,
  });
}

export function logout(payload: ApiLogoutPayload = {}) {
  return post<ApiLogoutResult, ApiLogoutPayload>("/auth/logout", {
    data: payload,
  });
}

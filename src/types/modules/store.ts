import type { ApiTokenPair, ApiUser, AuthPrincipal } from '@/types';

export type UserStoreState = {
  accessToken: string | null;
  authorization: AuthPrincipal;
  refreshToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  user: ApiUser | null;
};

export type UserStoreActions = {
  clearAuth: () => void;
  setAuthResponse: (user: ApiUser, tokens: ApiTokenPair) => void;
  setTokens: (tokens: ApiTokenPair) => void;
  setUser: (user: ApiUser | null) => void;
};

export type UserStore = UserStoreState & UserStoreActions;

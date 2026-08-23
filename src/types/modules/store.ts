import type {
  ApiTokenPair,
  ApiUser,
  AuthPrincipal,
  LoginResult,
  MeResult,
} from '@/types';

export type UserStoreState = {
  accessToken: string | null;
  authorization: AuthPrincipal;
  refreshToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  user: ApiUser | null;
  orderedDishCount: number | null;
};

export type UserStoreActions = {
  clearAuth: () => void;
  setLoginResult: (result: LoginResult) => void;
  setAuthResponse: (user: ApiUser, tokens: ApiTokenPair) => void;
  setTokens: (tokens: ApiTokenPair) => void;
  setUser: (user: ApiUser | null) => void;
  setUserInfo: (result: MeResult) => void;
};

export type UserStore = UserStoreState & UserStoreActions;

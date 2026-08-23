import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  decodeAuthPrincipalFromAccessToken,
  emptyAuthPrincipal,
  readPersistedStoreState,
} from '@/utils';
import type {
  ApiTokenPair,
  ApiUser,
  UserStore,
  UserStoreState,
} from '@/types';

const STORE_NAME = 'order-food-user-store';
const STORE_SCHEMA_VERSION = 2;

const initialState: UserStoreState = {
  accessToken: null,
  authorization: emptyAuthPrincipal,
  expiresIn: null,
  refreshToken: null,
  tokenType: null,
  user: null,
  orderedDishCount: null,
};

function resolveTokenType(tokens: ApiTokenPair) {
  return tokens.tokenType || 'Bearer';
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      clearAuth: () => set(initialState),
      setLoginResult: (result) =>
        set({
          accessToken: result.accessToken,
          authorization: decodeAuthPrincipalFromAccessToken(result.accessToken),
          expiresIn: result.expiresIn,
          refreshToken: result.refreshToken,
          tokenType: result.tokenType,
          user: result.user,
          orderedDishCount: null,
        }),
      setAuthResponse: (user, tokens) =>
        set({
          accessToken: tokens.accessToken,
          authorization: decodeAuthPrincipalFromAccessToken(tokens.accessToken),
          expiresIn: tokens.expiresIn,
          refreshToken: tokens.refreshToken,
          tokenType: resolveTokenType(tokens),
          user,
          orderedDishCount: null,
        }),
      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          authorization: decodeAuthPrincipalFromAccessToken(tokens.accessToken),
          expiresIn: tokens.expiresIn,
          refreshToken: tokens.refreshToken,
          tokenType: resolveTokenType(tokens),
        }),
      setUser: (user: ApiUser | null) => set({ user }),
      setUserInfo: (result) =>
        set({ user: result.user, orderedDishCount: result.orderedDishCount }),
    }),
    {
      name: STORE_NAME,
      version: STORE_SCHEMA_VERSION,
      partialize: (state) => ({
        accessToken: state.accessToken,
        expiresIn: state.expiresIn,
        refreshToken: state.refreshToken,
        tokenType: state.tokenType,
        user: state.user,
      }),
      merge: (persistedState, currentState) => {
        const mergedState = {
          ...currentState,
          ...(persistedState as Partial<UserStoreState>),
        };
        return {
          ...mergedState,
          authorization: decodeAuthPrincipalFromAccessToken(mergedState.accessToken ?? null),
        };
      },
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function readPersistedUserState(): Partial<UserStoreState> | null {
  return readPersistedStoreState<UserStoreState>(STORE_NAME, STORE_SCHEMA_VERSION);
}

export function getUserAuthorizationHeader(): string | undefined {
  const { accessToken, tokenType } = useUserStore.getState();
  return accessToken ? `${tokenType || 'Bearer'} ${accessToken}` : undefined;
}

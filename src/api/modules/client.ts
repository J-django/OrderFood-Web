import axios from 'axios';
import { showApiErrorToast } from '@/api/modules/error-notification';
import { logger } from '@/logger';
import { setupAxiosMonitoring } from '@/monitoring';
import { getCurrentFamilyId, getUserAuthorizationHeader, useUserStore } from '@/store';
import { clientEnv } from '@/utils';
import type { AxiosInstance, AxiosRequestHeaders } from 'axios';
import type { ApiTokenPair } from '@/types';

export const apiClient = axios.create({
  baseURL: clientEnv.apiBaseUrl,
  timeout: 20_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let apiInitialized = false;
let refreshTokensPromise: Promise<ApiTokenPair> | null = null;

const apiLogger = logger.child({
  scope: 'api.client',
  tags: { module: 'api' },
});

function setRequestHeader(headers: AxiosRequestHeaders | undefined, headerName: string, headerValue: string) {
  if (headers?.set) {
    headers.set(headerName, headerValue);
    return headers;
  }
  return { ...headers, [headerName]: headerValue } as AxiosRequestHeaders;
}

function hasRequestHeader(headers: AxiosRequestHeaders | undefined, headerName: string) {
  if (!headers) return false;
  if (headers.has) return headers.has(headerName) || headers.has(headerName.toLowerCase());
  return headerName in headers || headerName.toLowerCase() in headers;
}

function hasAuthorizationHeader(headers: AxiosRequestHeaders | undefined) {
  return hasRequestHeader(headers, 'Authorization');
}

function hasFetchAuthorizationHeader(headers: Headers) {
  return headers.has('Authorization') || headers.has('authorization');
}

function hasFamilyIdHeader(headers: AxiosRequestHeaders | undefined) {
  return hasRequestHeader(headers, 'x-family-id');
}

function isAuthRequest(url?: string) {
  return typeof url === 'string' && /(^|\/)auth\//.test(url);
}

function redirectToLogin() {
  if (typeof window === 'undefined' || window.location.pathname === '/login') return;
  const currentPath = `${window.location.pathname}${window.location.search}`;
  window.location.assign(`/login?redirect=${encodeURIComponent(currentPath)}`);
}

function logApiError(error: unknown) {
  if (axios.isCancel(error)) return;

  if (!axios.isAxiosError(error)) {
    apiLogger.error('API request failed', { tags: { errorType: 'unknown' }, error });
    return;
  }

  const method = (error.config?.method || 'get').toUpperCase();
  const url = error.config?.url || '/';
  const status = error.response?.status;
  const durationMs = Date.now() - (error.config?.metadata?.startedAt || Date.now());

  apiLogger.error('API request failed', {
    tags: { method, status: status ?? 'network_error' },
    context: {
      url,
      baseURL: error.config?.baseURL,
      requestId: error.config?.metadata?.requestId,
      durationMs,
      code: error.code,
      authRetry: error.config?.authRetry,
      skipAuth: error.config?.skipAuth,
      skipGlobalErrorToast: error.config?.skipGlobalErrorToast,
      response: error.response?.data,
    },
    error,
  });
}

async function refreshStoredAuthTokens() {
  const { refreshToken } = useUserStore.getState();
  if (!refreshToken) throw new Error('Refresh token is missing');

  refreshTokensPromise ??= apiClient
    .post<ApiTokenPair>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true, skipGlobalErrorToast: true },
    )
    .then((response) => {
      useUserStore.getState().setTokens(response.data);
      return response.data;
    })
    .finally(() => {
      refreshTokensPromise = null;
    });

  return refreshTokensPromise;
}

function withFetchAuthHeaders(headersInit?: HeadersInit, forceAuthorizationHeader = false): Headers {
  const headers = new Headers(headersInit);
  if (forceAuthorizationHeader || !hasFetchAuthorizationHeader(headers)) {
    const authorizationHeader = getUserAuthorizationHeader();
    if (authorizationHeader) headers.set('Authorization', authorizationHeader);
  }
  const familyId = getCurrentFamilyId();
  if (familyId && !headers.has('x-family-id')) {
    headers.set('x-family-id', familyId);
  }
  return headers;
}

export async function fetchWithApiAuth(input: string | URL, init: RequestInit = {}): Promise<Response> {
  const requestUrl = String(input);
  const response = await fetch(input, { ...init, headers: withFetchAuthHeaders(init.headers) });
  if (response.status !== 401 || isAuthRequest(requestUrl)) return response;

  try {
    await refreshStoredAuthTokens();
    return fetch(input, { ...init, headers: withFetchAuthHeaders(init.headers, true) });
  } catch (refreshError) {
    useUserStore.getState().clearAuth();
    redirectToLogin();
    throw refreshError;
  }
}

function setupAxiosAuth(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    if (config.skipAuth) return config;

    if (!hasAuthorizationHeader(config.headers)) {
      const authorizationHeader = getUserAuthorizationHeader();
      if (authorizationHeader) config.headers = setRequestHeader(config.headers, 'Authorization', authorizationHeader);
    }

    if (!hasFamilyIdHeader(config.headers)) {
      const familyId = getCurrentFamilyId();
      if (familyId) config.headers = setRequestHeader(config.headers, 'x-family-id', familyId);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        !axios.isAxiosError(error) ||
        error.response?.status !== 401 ||
        !error.config ||
        error.config.authRetry ||
        error.config.skipAuth ||
        isAuthRequest(error.config.url)
      ) {
        return Promise.reject(error);
      }

      try {
        error.config.authRetry = true;
        await refreshStoredAuthTokens();
        const authorizationHeader = getUserAuthorizationHeader();
        if (authorizationHeader) {
          error.config.headers = setRequestHeader(
            error.config.headers,
            'Authorization',
            authorizationHeader,
          );
        }
        return client.request(error.config);
      } catch (refreshError) {
        useUserStore.getState().clearAuth();
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    },
  );
}

function setupAxiosErrorNotification(client: AxiosInstance) {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      logApiError(error);
      showApiErrorToast(error);
      return Promise.reject(error);
    },
  );
}

export function initializeApiClient() {
  if (apiInitialized) return apiClient;
  setupAxiosAuth(apiClient);
  setupAxiosErrorNotification(apiClient);
  setupAxiosMonitoring(apiClient);
  apiInitialized = true;
  return apiClient;
}

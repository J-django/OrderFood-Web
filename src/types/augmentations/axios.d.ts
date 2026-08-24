declare module 'axios' {
  interface InternalAxiosRequestConfig {
    authRetry?: boolean;
    skipAuth?: boolean;
    skipFamilyId?: boolean;
    skipGlobalErrorToast?: boolean;
  }

  interface AxiosRequestConfig {
    authRetry?: boolean;
    skipAuth?: boolean;
    skipFamilyId?: boolean;
    skipGlobalErrorToast?: boolean;
  }
}

export {};

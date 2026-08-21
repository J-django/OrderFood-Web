import type { AxiosRequestMetadata } from '@/types';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    authRetry?: boolean;
    metadata?: AxiosRequestMetadata;
    skipAuth?: boolean;
    skipGlobalErrorToast?: boolean;
    skipMonitoringReport?: boolean;
  }

  interface AxiosRequestConfig {
    authRetry?: boolean;
    skipAuth?: boolean;
    skipGlobalErrorToast?: boolean;
    skipMonitoringReport?: boolean;
  }
}

export {};

import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestHeaders } from 'axios';
import { clientEnv } from '@/utils';
import { logger } from '@/logger';
import type { MonitoringBreadcrumb, MonitoringEventInput, MonitoringLevel } from '@/types';

const breadcrumbs: MonitoringBreadcrumb[] = [];
const requestHeaderName = 'x-request-id';

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function setHeader(headers: AxiosRequestHeaders | undefined, name: string, value: string) {
  if (headers?.set) {
    headers.set(name, value);
    return headers;
  }
  return { ...headers, [name]: value } as AxiosRequestHeaders;
}

function addMonitoringBreadcrumb(category: string, message: string, level: MonitoringLevel = 'info', data?: Record<string, unknown>) {
  breadcrumbs.push({ timestamp: new Date().toISOString(), category, message, level, data });
  if (breadcrumbs.length > 100) breadcrumbs.shift();
}

export function getMonitoringBreadcrumbs() {
  return [...breadcrumbs];
}

export function createRequestId() {
  return createId();
}

export function getMonitoringRequestHeaderName() {
  return requestHeaderName;
}

export async function reportMonitoringEvent(input: MonitoringEventInput) {
  if (!clientEnv.monitoringEnabled) return null;
  const event = {
    eventId: createId(),
    timestamp: new Date().toISOString(),
    ...input,
    breadcrumbs: getMonitoringBreadcrumbs(),
    route: typeof window === 'undefined' ? '/' : window.location.pathname,
  };
  try {
    await fetch(clientEnv.monitoringEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch (error) {
    logger.warn('Monitoring event transport failed', { scope: 'monitoring', error });
  }
  return event;
}

export function reportApiError(input: {
  message: string;
  requestId?: string;
  method?: string;
  url?: string;
  status?: number | 'network_error';
  durationMs?: number;
  response?: unknown;
  error?: unknown;
}) {
  return reportMonitoringEvent({
    category: 'api',
    subtype: 'http_error',
    ...input,
    extra: { response: input.response },
  });
}

export function setupAxiosMonitoring(apiClient: AxiosInstance) {
  apiClient.interceptors.request.use((config) => {
    if (config.skipMonitoringReport) return config;
    const requestId = createRequestId();
    const method = (config.method || 'get').toUpperCase();
    config.headers = setHeader(config.headers, requestHeaderName, requestId);
    config.metadata = { requestId, startedAt: Date.now() };
    addMonitoringBreadcrumb('http.request', `${method} ${config.url || '/'}`, 'info', { requestId });
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => {
      if (!response.config.skipMonitoringReport) {
        addMonitoringBreadcrumb('http.response', `${response.status} ${response.config.url || '/'}`, 'info', {
          requestId: response.config.metadata?.requestId,
          durationMs: Date.now() - (response.config.metadata?.startedAt || Date.now()),
          status: response.status,
        });
      }
      return response;
    },
    async (error: AxiosError) => {
      if (error.code !== axios.AxiosError.ERR_CANCELED && !error.config?.skipMonitoringReport) {
        const durationMs = Date.now() - (error.config?.metadata?.startedAt || Date.now());
        const method = (error.config?.method || 'get').toUpperCase();
        const url = error.config?.url || '/';
        addMonitoringBreadcrumb('http.error', `${method} ${url}`, 'error', { durationMs, status: error.response?.status });
        await reportApiError({
          message: error.message || 'Request failed',
          requestId: error.config?.metadata?.requestId,
          method,
          url,
          status: error.response?.status || 'network_error',
          durationMs,
          response: error.response?.data,
          error,
        });
      }
      return Promise.reject(error);
    },
  );
}

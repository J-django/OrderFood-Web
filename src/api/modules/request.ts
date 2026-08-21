import { createApiCancelController, forwardAbortSignal } from "@/api/modules/cancel";
import { initializeApiClient } from "@/api/modules/client";
import { AxiosError } from "axios";
import type { AxiosInstance } from "axios";
import type {
  ApiCancelableTask,
  ApiMethod,
  ApiRequestMethodOptions,
  ApiRequestOptions,
  ApiResponse,
} from "@/types";

function resolveClient(client?: AxiosInstance) {
  return client ?? initializeApiClient();
}

function buildRequestOptions<TData = unknown>(
  options: ApiRequestOptions<TData>,
  signal?: AbortSignal,
) {
  const { client, ...config } = options;

  return {
    client,
    config: {
      ...config,
      signal: signal ?? config.signal,
    },
  };
}

export function isApiRequestCanceled(error: unknown): boolean {
  return error instanceof AxiosError && error.code === AxiosError.ERR_CANCELED;
}

export async function request<TResponse = unknown, TData = unknown>(
  options: ApiRequestOptions<TData>,
): Promise<TResponse> {
  const { client, config } = buildRequestOptions(options);
  const response = await resolveClient(client).request<
    TResponse,
    ApiResponse<TResponse, TData>,
    TData
  >(config);

  return response.data;
}

export function createCancelableRequest<TResponse = unknown, TData = unknown>(
  options: ApiRequestOptions<TData>,
): ApiCancelableTask<TResponse> {
  const cancelController = createApiCancelController();
  const cleanupForwardAbort = forwardAbortSignal(options.signal, cancelController);
  const { client, config } = buildRequestOptions(options, cancelController.signal);
  const task = resolveClient(client)
    .request<TResponse, ApiResponse<TResponse, TData>, TData>(config)
    .then((response) => response.data)
    .finally(cleanupForwardAbort);

  return {
    abort: cancelController.abort,
    signal: cancelController.signal,
    unwrap: () => task,
  };
}

export function createRequestMethod(method: ApiMethod) {
  return function requestMethod<TResponse = unknown, TData = unknown>(
    url: string,
    options?: ApiRequestMethodOptions<TData>,
  ): Promise<TResponse> {
    return request<TResponse, TData>({
      ...options,
      method,
      url,
    });
  };
}

export function createCancelableRequestMethod(method: ApiMethod) {
  return function cancelableRequestMethod<TResponse = unknown, TData = unknown>(
    url: string,
    options?: ApiRequestMethodOptions<TData>,
  ): ApiCancelableTask<TResponse> {
    return createCancelableRequest<TResponse, TData>({
      ...options,
      method,
      url,
    });
  };
}

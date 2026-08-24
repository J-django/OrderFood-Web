import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  GenericAbortSignal,
} from "axios";

export type ApiPrimitive = string | number | boolean | null | undefined;
export type ApiQueryValue = ApiPrimitive | ApiPrimitive[];
export type ApiQuery = Record<string, ApiQueryValue>;

export type ApiRequestConfig<TData = unknown> = Omit<
  AxiosRequestConfig<TData>,
  "params" | "signal"
> & {
  params?: ApiQuery;
  signal?: GenericAbortSignal;
  skipAuth?: boolean;
  skipFamilyId?: boolean;
  skipGlobalErrorToast?: boolean;
};

export type ApiRequestOptions<TData = unknown> = ApiRequestConfig<TData> & {
  client?: AxiosInstance;
};

export type ApiMethod = "get" | "post" | "put" | "patch" | "delete";
export type ApiRequestMethodOptions<TData = unknown> = ApiRequestOptions<TData>;
export type ApiResponse<TResponse = unknown, TData = unknown> = AxiosResponse<
  TResponse,
  TData
>;

export type ApiAbortSignalLike = GenericAbortSignal & {
  addEventListener?: (
    type: "abort",
    listener: () => void,
    options?: AddEventListenerOptions,
  ) => void;
  removeEventListener?: (type: "abort", listener: () => void) => void;
};

export type ApiCancelableTask<TResponse = unknown> = {
  abort: (reason?: string) => void;
  signal: AbortSignal;
  unwrap: () => Promise<TResponse>;
};

export type ApiCancelController = {
  abort: (reason?: string) => void;
  readonly signal: AbortSignal;
};

export type ApiEndpointOptions<TData = unknown> = Omit<
  ApiRequestMethodOptions<TData>,
  "data" | "method" | "url"
>;

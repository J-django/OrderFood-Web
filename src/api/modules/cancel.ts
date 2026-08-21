import type { ApiAbortSignalLike, ApiCancelController } from "@/types";

export function createApiCancelController(): ApiCancelController {
  const controller = new AbortController();

  return {
    abort: (reason) => controller.abort(reason),
    signal: controller.signal,
  };
}

export function forwardAbortSignal(
  source: ApiAbortSignalLike | undefined,
  target: ApiCancelController,
) {
  if (!source || !supportsAbortEvents(source)) {
    return () => {};
  }

  if (source.aborted) {
    target.abort(readAbortReason(source));
    return () => {};
  }

  const handleAbort = () => {
    target.abort(readAbortReason(source));
  };

  source.addEventListener("abort", handleAbort, { once: true });

  return () => {
    source.removeEventListener("abort", handleAbort);
  };
}

function readAbortReason(signal: ApiAbortSignalLike) {
  return "reason" in signal && typeof signal.reason === "string"
    ? signal.reason
    : undefined;
}

function supportsAbortEvents(
  signal: ApiAbortSignalLike,
): signal is ApiAbortSignalLike & {
  addEventListener: NonNullable<ApiAbortSignalLike["addEventListener"]>;
  removeEventListener: NonNullable<ApiAbortSignalLike["removeEventListener"]>;
} {
  return (
    typeof signal.addEventListener === "function" &&
    typeof signal.removeEventListener === "function"
  );
}

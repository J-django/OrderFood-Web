import {
  createCancelableRequestMethod,
  createRequestMethod,
} from "@/api/modules/request";

export const get = createRequestMethod("get");
export const post = createRequestMethod("post");
export const put = createRequestMethod("put");
export const patch = createRequestMethod("patch");
export const del = createRequestMethod("delete");
export const remove = del;

export const getCancelable = createCancelableRequestMethod("get");
export const postCancelable = createCancelableRequestMethod("post");
export const putCancelable = createCancelableRequestMethod("put");
export const patchCancelable = createCancelableRequestMethod("patch");
export const deleteCancelable = createCancelableRequestMethod("delete");
export const removeCancelable = deleteCancelable;

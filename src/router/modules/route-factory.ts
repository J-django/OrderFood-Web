import type { RouteObject } from "react-router";
import type { RouteConfig, RouteSharedConfig } from "@/types";

function createLazyRoute(
  config: RouteConfig,
  sharedConfig: RouteSharedConfig,
): RouteObject {
  const route = {
    ...sharedConfig,
    handle: config.handle,
    lazy: async () => ({ Component: await config.load() }),
  };

  if ("index" in config) {
    return { ...route, index: true };
  }

  return {
    ...route,
    path: config.path,
    children: config.children?.map((child) =>
      createLazyRoute(child, sharedConfig),
    ),
  };
}

function buildRoutesFromConfig(
  configs: RouteConfig[],
  sharedConfig: RouteSharedConfig,
): RouteObject[] {
  return configs.map((config) => createLazyRoute(config, sharedConfig));
}

export { buildRoutesFromConfig };

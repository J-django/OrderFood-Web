import type { ComponentType } from "react";
import type { RouteObject } from "react-router";

export type RouteSharedConfig = Pick<
  RouteObject,
  "errorElement" | "hydrateFallbackElement"
>;

export type RouteHandle = {
  title?: string;
};

export type RouteConfigBase = {
  handle?: RouteHandle;
  load: () => Promise<ComponentType>;
};

export type PathRouteConfig = RouteConfigBase & {
  children?: RouteConfig[];
  path: string;
};

export type IndexRouteConfig = RouteConfigBase & {
  index: true;
};

export type RouteConfig = PathRouteConfig | IndexRouteConfig;

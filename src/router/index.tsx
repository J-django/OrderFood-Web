import { createBrowserRouter } from "react-router";
import { routeConfigs } from "@/constants";
import { buildRoutesFromConfig } from "./modules/route-factory";
import { routeSharedConfig } from "./modules/route-shared-config";

export const router = createBrowserRouter(
  buildRoutesFromConfig(routeConfigs, routeSharedConfig),
);

import type { ComponentType } from "react";

function lazyPage(importer: () => Promise<{ default: ComponentType }>) {
  return async () => (await importer()).default;
}

export { lazyPage };

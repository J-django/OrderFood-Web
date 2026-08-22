/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import type { SegmentedContextValue } from "../types";

const SegmentedContext = createContext<SegmentedContextValue | null>(null);

function useSegmentedContext() {
  const context = useContext(SegmentedContext);
  if (!context) throw new Error("Segmented.Item must be used inside Segmented.");
  return context;
}

export { SegmentedContext, useSegmentedContext };

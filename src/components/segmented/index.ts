import { SegmentedItem } from "./components/item";
import { SegmentedRoot } from "./components/segmented";

const Segmented = Object.assign(SegmentedRoot, { Item: SegmentedItem });

export { Segmented };
export type * from "./types";

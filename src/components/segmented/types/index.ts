import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
  RefObject,
} from "react";

type SegmentedWidth = "fit" | "full";

type SegmentedContextValue = {
  disabled?: boolean;
  itemRefs: RefObject<Map<string, HTMLButtonElement>>;
  onItemSelect: (value: string) => void;
  selectedValue: string | undefined;
};

type SegmentedProps = Omit<ComponentPropsWithoutRef<"div">, "defaultValue"> & {
  defaultValue?: string;
  disabled?: boolean;
  indicatorClassName?: string;
  onValueChange?: (value: string) => void;
  value?: string;
  width?: SegmentedWidth;
};

type SegmentedItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> & {
  value: string;
  children?: ReactNode;
};

type SegmentedIndicatorMetrics = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export type {
  SegmentedContextValue,
  SegmentedIndicatorMetrics,
  SegmentedItemProps,
  SegmentedProps,
  SegmentedWidth,
};

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/utils";
import { SegmentedContext } from "./context";
import type { ReactElement } from "react";
import type {
  SegmentedContextValue,
  SegmentedIndicatorMetrics,
  SegmentedItemProps,
  SegmentedProps,
} from "../types";

function resolveInitialValue(
  value: string | undefined,
  defaultValue: string | undefined,
  children: SegmentedProps["children"],
) {
  if (value !== undefined) return value;
  if (defaultValue !== undefined) return defaultValue;
  const firstItem = Children.toArray(children).find(
    (child): child is ReactElement<SegmentedItemProps> =>
      isValidElement<SegmentedItemProps>(child) &&
      typeof child.props.value === "string",
  );
  return firstItem?.props.value;
}

function SegmentedRoot({
  children,
  className,
  defaultValue,
  disabled = false,
  indicatorClassName,
  onValueChange,
  value,
  width = "fit",
  ...restProps
}: SegmentedProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() =>
    resolveInitialValue(value, defaultValue, children),
  );
  const selectedValue = isControlled ? value : internalValue;
  const [indicatorMetrics, setIndicatorMetrics] =
    useState<SegmentedIndicatorMetrics | null>(null);

  const updateIndicatorMetrics = useCallback(() => {
    const rootElement = rootRef.current;
    const selectedElement = selectedValue
      ? itemRefs.current.get(selectedValue)
      : null;
    if (!rootElement || !selectedElement) {
      setIndicatorMetrics(null);
      return;
    }
    const nextMetrics = {
      height: selectedElement.offsetHeight,
      left: selectedElement.offsetLeft,
      top: selectedElement.offsetTop,
      width: selectedElement.offsetWidth,
    };
    setIndicatorMetrics((currentMetrics) =>
      currentMetrics?.height === nextMetrics.height &&
      currentMetrics.left === nextMetrics.left &&
      currentMetrics.top === nextMetrics.top &&
      currentMetrics.width === nextMetrics.width
        ? currentMetrics
        : nextMetrics,
    );
  }, [selectedValue]);

  useEffect(() => updateIndicatorMetrics(), [updateIndicatorMetrics]);

  useEffect(() => {
    const rootElement = rootRef.current;
    const selectedElement = selectedValue
      ? itemRefs.current.get(selectedValue)
      : null;
    if (!rootElement || !selectedElement) return;
    const resizeObserver = new ResizeObserver(updateIndicatorMetrics);
    resizeObserver.observe(rootElement);
    resizeObserver.observe(selectedElement);
    return () => resizeObserver.disconnect();
  }, [selectedValue, updateIndicatorMetrics]);

  const contextValue = useMemo<SegmentedContextValue>(
    () => ({
      disabled,
      itemRefs,
      onItemSelect: (nextValue) => {
        if (!isControlled) setInternalValue(nextValue);
        onValueChange?.(nextValue);
      },
      selectedValue,
    }),
    [disabled, isControlled, onValueChange, selectedValue],
  );

  return (
    <SegmentedContext.Provider value={contextValue}>
      <div
        ref={rootRef}
        data-lc-width={width}
        data-slot="segmented"
        role="radiogroup"
        aria-disabled={disabled}
        className={cn(
          "group/segmented relative inline-flex max-w-full items-center justify-center gap-0.5 rounded-full bg-[#ededed] p-0.5 text-[#777] data-[lc-width=full]:flex data-[lc-width=full]:w-full",
          disabled && "pointer-events-none opacity-60",
          className,
        )}
        {...restProps}
      >
        {indicatorMetrics ? (
          <motion.span
            aria-hidden="true"
            data-slot="segmented-indicator"
            className={cn(
              "pointer-events-none absolute top-0 left-0 rounded-full border border-transparent bg-white shadow-sm",
              indicatorClassName,
            )}
            animate={{
              height: indicatorMetrics.height,
              x: indicatorMetrics.left,
              y: indicatorMetrics.top,
              width: indicatorMetrics.width,
            }}
            initial={false}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
        {children}
      </div>
    </SegmentedContext.Provider>
  );
}

export { SegmentedRoot };

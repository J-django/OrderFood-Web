import { useCallback } from "react";
import { useSegmentedContext } from "./context";
import { cn } from "@/utils";
import type { KeyboardEvent, RefObject } from "react";
import type { SegmentedItemProps } from "../types";

const nextKeySet = new Set(["ArrowRight", "ArrowDown"]);
const previousKeySet = new Set(["ArrowLeft", "ArrowUp"]);

function getEnabledItems(itemRefs: RefObject<Map<string, HTMLButtonElement>>) {
  return Array.from(itemRefs.current.entries()).filter(
    ([, item]) => !item.disabled,
  );
}

function SegmentedItem({
  children,
  className,
  disabled = false,
  onClick,
  onKeyDown,
  type = "button",
  value,
  ...restProps
}: SegmentedItemProps) {
  const context = useSegmentedContext();
  const selected = context.selectedValue === value;
  const itemDisabled = disabled || context.disabled;
  const itemRefs = context.itemRefs.current;
  const itemRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (node) itemRefs.set(value, node);
      else itemRefs.delete(value);
    },
    [itemRefs, value],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const direction = nextKeySet.has(event.key)
      ? 1
      : previousKeySet.has(event.key)
        ? -1
        : 0;
    if (!direction) return;
    const enabledItems = getEnabledItems(context.itemRefs);
    const activeIndex = enabledItems.findIndex(([itemValue]) => itemValue === value);
    if (activeIndex < 0) return;
    const nextItem = enabledItems[(activeIndex + direction + enabledItems.length) % enabledItems.length];
    if (!nextItem) return;
    event.preventDefault();
    context.onItemSelect(nextItem[0]);
    nextItem[1].focus();
  }

  return (
    <button
      ref={itemRef}
      data-lc-active={selected ? "true" : "false"}
      data-slot="segmented-item"
      role="radio"
      aria-checked={selected}
      disabled={itemDisabled}
      tabIndex={selected ? 0 : -1}
      type={type}
      className={cn(
        "relative z-1 inline-flex h-7 min-w-0 shrink-0 cursor-pointer items-center justify-center rounded-full px-3 text-sm leading-none font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-200 outline-none select-none hover:bg-[#cdcdcd]/50 hover:text-[#222] focus-visible:ring-3 focus-visible:ring-(--theme-color)/30 data-[lc-active=true]:bg-transparent data-[lc-active=true]:text-[#222] group-data-[lc-width=full]/segmented:flex-1 group-data-[lc-width=full]/segmented:basis-0 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !itemDisabled) context.onItemSelect(value);
      }}
      onKeyDown={handleKeyDown}
      {...restProps}
    >
      {children}
    </button>
  );
}

export { SegmentedItem };

import { Link } from "react-router";
import { Image } from "@/components/image";
import { cn } from "@/utils";
import type { MouseEvent } from "react";
import type { FoodCardImageSize, FoodCardProps } from "../types";

const imageSizeClasses: Record<FoodCardImageSize, string> = {
  sm: "size-13 rounded-md",
  md: "size-15 rounded-md",
  lg: "size-17 rounded-xl",
};

function HighlightedText({ text, keyword }: { text: string; keyword: string }) {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();
  const matchIndex = text.toLocaleLowerCase().indexOf(normalizedKeyword);

  if (!normalizedKeyword || matchIndex < 0) {
    return text;
  }

  const matchEnd = matchIndex + normalizedKeyword.length;

  return (
    <>
      {text.slice(0, matchIndex)}
      <mark className="bg-transparent font-semibold text-(--theme-color)">
        {text.slice(matchIndex, matchEnd)}
      </mark>
      {text.slice(matchEnd)}
    </>
  );
}

function DetailLine({
  label,
  value,
  keyword,
  truncate,
  emptyText,
}: {
  label: string;
  value: string;
  keyword?: string;
  truncate?: boolean;
  emptyText?: string;
}) {
  const isEmpty = !value.trim();

  if (isEmpty && truncate && emptyText) {
    return (
      <p className="w-full truncate text-xs leading-4 text-[#777]">
        <span className="font-medium text-[#555]">{label}：</span>
        {emptyText}
      </p>
    );
  }

  return (
    <p
      className={cn(
        "w-full overflow-hidden text-xs leading-4 text-[#777]",
        truncate && "truncate",
      )}
    >
      <span className="font-medium text-[#555]">{label}：</span>
      {keyword ? (
        <HighlightedText text={value} keyword={keyword} />
      ) : (
        value || emptyText
      )}
    </p>
  );
}

export function FoodCard({
  item,
  keyword,
  selected,
  onToggle,
  linkTo,
  imageSize = "lg",
  compact = false,
  truncateDetail = false,
  emptyDetailText,
  onClick,
  className,
}: FoodCardProps) {
  const isSmall = imageSize === "sm";

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onToggle?.(item);
  }

  function handleClick() {
    onClick?.();
  }

  return (
    <article
      onClick={onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      aria-label={onClick ? `查看${item.name}` : undefined}
      className={cn(
        "relative flex w-full min-w-0 items-start overflow-hidden border-b border-[#f0f0f0] p-2.5 text-left transition-colors last:border-b-0",
        selected && "bg-[#fff8f4]",
        onClick && "cursor-pointer active:bg-stone-50",
        className,
      )}
    >
      {linkTo && (
        <Link
          to={linkTo}
          aria-label={`查看${item.name}详情`}
          className="absolute inset-0 z-0"
          onClick={(event) => event.stopPropagation()}
        />
      )}
      <div
        className={cn(
          "shrink-0 overflow-hidden bg-stone-100",
          imageSizeClasses[imageSize],
        )}
      >
        <Image
          src={item.image}
          alt={item.name}
          classes={{
            container: "size-full",
            image: "object-cover",
          }}
        />
      </div>
      <div className="ml-2 min-w-0 flex-1">
        <div className="flex w-full items-start">
          <h3
            className={cn(
              "min-w-0 flex-1 font-semibold text-[#222]",
              isSmall ? "mb-0.5" : "mb-1",
              compact
                ? "text-sm leading-5 font-normal"
                : isSmall
                  ? "text-[13px] leading-4.5"
                  : "text-base leading-5.5",
            )}
          >
            {keyword ? (
              <HighlightedText text={item.name} keyword={keyword} />
            ) : (
              item.name
            )}
          </h3>
          {onToggle && !compact && (
            <button
              type="button"
              aria-label={
                selected ? `取消选择${item.name}` : `选择${item.name}`
              }
              aria-pressed={selected}
              onClick={handleToggle}
              className={cn(
                "relative z-10 ml-1.5 flex size-5 shrink-0 translate-x-0.5 -translate-y-0.5 cursor-pointer items-center justify-center rounded-full text-white transition-colors before:absolute before:top-1/2 before:left-1/2 before:size-9 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:content-['']",
                selected
                  ? "bg-[#999] active:bg-[#777]"
                  : "bg-(--theme-color) active:bg-(--theme-color-active)",
              )}
            >
              <span
                className={cn(
                  selected ? "icon-[tabler--minus]" : "icon-[tabler--plus]",
                  "size-4",
                )}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
        {!compact && (
          <>
            <DetailLine
              label="食材"
              value={item.ingredients}
              keyword={keyword}
              truncate={truncateDetail || isSmall}
              emptyText={emptyDetailText}
            />
            <div className="mt-px">
              <DetailLine
                label="配料"
                value={item.seasonings}
                keyword={keyword}
                truncate={truncateDetail || isSmall}
                emptyText={emptyDetailText}
              />
            </div>
          </>
        )}
      </div>
    </article>
  );
}

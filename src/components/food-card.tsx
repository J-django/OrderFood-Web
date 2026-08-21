import { Link } from "react-router";
import type { MouseEvent } from "react";
import type { MenuItem } from "@/types";
import { cn } from "@/utils";

interface FoodCardProps {
  item: MenuItem;
  selected: boolean;
  keyword: string;
  onToggle: (item: MenuItem) => void;
}

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
      <mark className="bg-transparent font-semibold text-[#ff5f15]">
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
}: {
  label: string;
  value: string;
  keyword: string;
}) {
  return (
    <p className="w-full overflow-hidden text-xs leading-4 text-[#777]">
      <span className="font-medium text-[#555]">{label}：</span>
      <HighlightedText text={value} keyword={keyword} />
    </p>
  );
}

export function FoodCard({ item, selected, keyword, onToggle }: FoodCardProps) {
  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onToggle(item);
  }

  return (
    <article
      className={cn(
        "relative flex w-full min-w-0 items-start overflow-hidden border-b border-[#f0f0f0] p-2.5 transition-colors last:border-b-0",
        selected && "bg-[#fff8f4]",
      )}
    >
      <Link
        to={`/menu/${item.id}`}
        aria-label={`查看${item.name}详情`}
        className="absolute inset-0 z-0"
      />
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        className="size-17 shrink-0 rounded-xl bg-stone-100 object-cover"
      />
      <div className="ml-2 min-w-0 flex-1">
        <div className="flex w-full items-start">
          <h3 className="mb-1 min-w-0 flex-1 text-base leading-5.5 font-semibold text-[#222]">
            <HighlightedText text={item.name} keyword={keyword} />
          </h3>
          <button
            type="button"
            aria-label={selected ? `取消选择${item.name}` : `选择${item.name}`}
            aria-pressed={selected}
            onClick={handleToggle}
            className={cn(
              "relative z-10 ml-1.5 flex size-5 shrink-0 translate-x-0.5 -translate-y-0.5 items-center justify-center rounded-full text-white transition-colors",
              selected
                ? "bg-[#999] active:bg-[#777]"
                : "bg-[#ff5f15] active:bg-[#e94f0b]",
            )}
          >
            <span
              className={cn(
                selected ? "icon-[lucide--minus]" : "icon-[lucide--plus]",
                "size-4",
              )}
              aria-hidden="true"
            />
          </button>
        </div>
        <DetailLine label="食材" value={item.ingredients} keyword={keyword} />
        <div className="mt-px">
          <DetailLine label="配料" value={item.seasonings} keyword={keyword} />
        </div>
      </div>
    </article>
  );
}

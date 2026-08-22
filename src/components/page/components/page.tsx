import { useNavigate } from "react-router";
import { cn } from "@/utils";
import type { PageContentProps, PageHeaderProps, PageProps } from "../types";

function Page({ className, ...props }: PageProps) {
  return (
    <div
      data-slot="page"
      className={cn(
        "flex h-[calc(100dvh-var(--layout-bottom-offset))] min-h-0 w-full flex-col overflow-hidden bg-white",
        className,
      )}
      {...props}
    />
  );
}

function PageHeader({
  title,
  backTo = "/",
  trailing,
  className,
  ...props
}: PageHeaderProps) {
  const navigate = useNavigate();

  function handleBack() {
    const historyIndex = window.history.state?.idx;

    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(backTo, { replace: true });
  }

  return (
    <header
      data-slot="page-header"
      className={cn(
        "h-[calc(3.5rem+env(safe-area-inset-top))] shrink-0 border-b border-stone-100 bg-white px-2 pt-[env(safe-area-inset-top)]",
        className,
      )}
      {...props}
    >
      <nav
        aria-label={`${title}页面导航`}
        className="grid h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center"
      >
        <button
          type="button"
          aria-label="返回"
          onClick={handleBack}
          className="hover:bg-muted-foreground/15 active:bg-muted-foreground/15 grid size-10 place-items-center rounded-full text-stone-700 transition-colors select-none"
        >
          <span className="icon-[tabler--chevron-left] size-6.5" />
        </button>
        <h1 className="text-4 pointer-events-none mx-auto max-w-48 truncate text-center font-bold text-stone-900 select-none">
          {title}
        </h1>
        <div className="flex size-10 items-center justify-center select-none">
          {trailing}
        </div>
      </nav>
    </header>
  );
}

function PageContent({ className, ...props }: PageContentProps) {
  return (
    <div
      data-slot="page-content"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain",
        className,
      )}
      {...props}
    />
  );
}

export { Page, PageContent, PageHeader };

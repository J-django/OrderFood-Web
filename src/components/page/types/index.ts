import type { HTMLAttributes, ReactNode } from "react";
import type { To } from "react-router";

type PageProps = HTMLAttributes<HTMLDivElement>;

type PageHeaderProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  backTo?: To;
  showBack?: boolean;
  title: ReactNode;
  trailing?: ReactNode;
};

type PageContentProps = HTMLAttributes<HTMLDivElement>;

export type { PageContentProps, PageHeaderProps, PageProps };

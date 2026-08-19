import type { HTMLAttributes, ReactNode } from "react";
import type { To } from "react-router";

type PageProps = HTMLAttributes<HTMLDivElement>;

type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  backTo?: To;
  title: string;
  trailing?: ReactNode;
};

type PageContentProps = HTMLAttributes<HTMLDivElement>;

export type { PageContentProps, PageHeaderProps, PageProps };

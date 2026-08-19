import { Page, PageContent, PageHeader } from "./components/page";

const PageRoot = Object.assign(Page, {
  Content: PageContent,
  Header: PageHeader,
});

export { PageRoot as Page, PageContent, PageHeader };
export type * from "./types";

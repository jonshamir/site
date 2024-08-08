import type { MdxFile, PageMapItem } from "nextra";
import type { LayoutProps } from "../types";
import { sortDate } from "./date";
import traverse from "./traverse";

const isNav = (page: PageMapItem): page is MdxFile => {
  const type = "frontMatter" in page && page.frontMatter?.type;
  return type && ["page", "posts", "lab"].includes(type);
};
const isPost = (page: PageMapItem): page is MdxFile => {
  if (
    page.kind === "Folder" ||
    page.kind === "Meta" ||
    page.name.startsWith("_")
  )
    return false;
  const { draft, type } = page.frontMatter || {};
  return !draft && (!type || type === "post");
};

export const collectPostsAndNavs = ({ opts }: LayoutProps) => {
  const posts: MdxFile[] = [];
  const navPages: (MdxFile & { active: boolean })[] = [];
  const { route } = opts;
  traverse(opts.pageMap, (page) => {
    if (isNav(page)) {
      navPages.push({ ...page, active: page.route === route });
    }
    if (isPost(page)) {
      posts.push(page);
    }
  });
  posts.sort(sortDate);
  return { posts, navPages };
};

const isExperiment = (page: PageMapItem): page is MdxFile => {
  if (
    page.kind === "Folder" ||
    page.kind === "Meta" ||
    page.name.startsWith("_")
  )
    return false;
  const { draft, type } = page.frontMatter || {};
  return !draft && type === "experiment";
};

export const collectExperiments = ({ opts }: LayoutProps) => {
  const experiments: MdxFile[] = [];
  traverse(opts.pageMap, (page) => {
    if (isExperiment(page)) {
      experiments.push(page);
    }
  });
  experiments.sort(sortDate);
  return { experiments };
};

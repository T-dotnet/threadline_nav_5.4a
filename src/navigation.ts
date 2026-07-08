import { Page } from "./types";
import { SHOW_WORKSPACE_TOOLS } from "./lib/workspaceTools";

export const assessmentPages: Page[] = [
  "understanding",
  "priorities",
  "roadmap",
  "reviews",
  "emerging-details",
];

export const newChildAllowedPages: Page[] = [
  "home",
  "preview",
  "assessment",
  "what-you-noticed",
  "understanding",
  "priorities",
  "resources",
  "documents",
  "diary",
  "settings",
  "all-children",
  ...(SHOW_WORKSPACE_TOOLS ? ["style-guide" as Page] : []),
];

export function isAssessmentPage(page?: Page | string): boolean {
  return assessmentPages.includes(page as Page);
}

export function isNewChildAllowedPage(page?: Page | string): boolean {
  return newChildAllowedPages.includes(page as Page);
}

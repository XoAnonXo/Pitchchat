import { getSiteUrl } from "@/lib/site";

export type PseoRouteContext = {
  industry: string;
  stage: string;
  pageType: string;
};

export function buildPseoPagePath(context: PseoRouteContext) {
  return `/investor-questions/${context.industry}/${context.stage}/${context.pageType}/`;
}

export function buildPseoPageUrl(context: PseoRouteContext) {
  const base = getSiteUrl().replace(/\/$/, "");
  return `${base}${buildPseoPagePath(context)}`;
}

export function buildIndustryHubPath(industry: string) {
  return `/investor-questions/industries/${industry}/`;
}

export function buildStageHubPath(stage: string) {
  return `/investor-questions/stages/${stage}/`;
}

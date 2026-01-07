import type { MetadataRoute } from "next";

import pilotConfig from "@/data/pilot-config.json";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/investor-questions/`,
      lastModified: now,
    },
    {
      url: `${siteUrl}/investor-questions/industries/`,
      lastModified: now,
    },
    {
      url: `${siteUrl}/investor-questions/stages/`,
      lastModified: now,
    },
  ];

  for (const industry of pilotConfig.industries) {
    entries.push({
      url: `${siteUrl}/investor-questions/industries/${industry.slug}/`,
      lastModified: now,
    });
  }

  for (const stage of pilotConfig.stages) {
    entries.push({
      url: `${siteUrl}/investor-questions/stages/${stage.slug}/`,
      lastModified: now,
    });
  }

  for (const industry of pilotConfig.industries) {
    for (const stage of pilotConfig.stages) {
      for (const pageType of pilotConfig.pageTypes) {
        entries.push({
          url: `${siteUrl}/investor-questions/${industry.slug}/${stage.slug}/${pageType.slug}/`,
          lastModified: now,
        });
      }
    }
  }

  return entries;
}

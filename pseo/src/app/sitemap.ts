import type { MetadataRoute } from "next";

import pilotConfig from "@/data/pilot-config.json";
import { getPublishedPagesForSitemap } from "@/db/queries";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

// Static date for hub/index pages that don't have DB timestamps
const STATIC_PAGES_DATE = new Date("2025-01-01T00:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch published pages from DB with actual timestamps
  const publishedPages = await getPublishedPagesForSitemap();
  const publishedSlugsMap = new Map(
    publishedPages.map((p) => [p.slug, p.updatedAt])
  );

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: STATIC_PAGES_DATE,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/investor-questions/`,
      lastModified: STATIC_PAGES_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/investor-questions/industries/`,
      lastModified: STATIC_PAGES_DATE,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/investor-questions/stages/`,
      lastModified: STATIC_PAGES_DATE,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  for (const industry of pilotConfig.industries) {
    entries.push({
      url: `${siteUrl}/investor-questions/industries/${industry.slug}/`,
      lastModified: STATIC_PAGES_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  for (const stage of pilotConfig.stages) {
    entries.push({
      url: `${siteUrl}/investor-questions/stages/${stage.slug}/`,
      lastModified: STATIC_PAGES_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // Only include pSEO pages that are published in the DB
  for (const industry of pilotConfig.industries) {
    for (const stage of pilotConfig.stages) {
      for (const pageType of pilotConfig.pageTypes) {
        const slug = `/investor-questions/${industry.slug}/${stage.slug}/${pageType.slug}/`;
        const dbUpdatedAt = publishedSlugsMap.get(slug);

        // Only include if page is published (exists in publishedSlugsMap)
        if (dbUpdatedAt !== undefined) {
          entries.push({
            url: `${siteUrl}${slug}`,
            lastModified: dbUpdatedAt ?? STATIC_PAGES_DATE,
            changeFrequency: "weekly",
            priority: 0.9,
          });
        }
      }
    }
  }

  return entries;
}

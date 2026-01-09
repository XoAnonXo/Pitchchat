import { getSiteUrl } from "@/lib/site";

export type SitemapUrl = {
  url: string;
  lastModified?: Date | null;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Static fallback date for pages without DB timestamps
const STATIC_FALLBACK_DATE = new Date("2025-01-01T00:00:00Z");

export function buildSitemapXml(urls: (string | SitemapUrl)[]) {
  const items = urls
    .map((entry) => {
      const url = typeof entry === "string" ? entry : entry.url;
      const lastMod = typeof entry === "string"
        ? STATIC_FALLBACK_DATE
        : (entry.lastModified ?? STATIC_FALLBACK_DATE);
      const changeFreq = typeof entry === "string" ? undefined : entry.changeFrequency;
      const priority = typeof entry === "string" ? undefined : entry.priority;

      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastMod.toISOString()}</lastmod>${changeFreq ? `
    <changefreq>${changeFreq}</changefreq>` : ""}${priority !== undefined ? `
    <priority>${priority}</priority>` : ""}
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export function buildAbsoluteUrl(pathname: string) {
  const base = getSiteUrl().replace(/\/$/, "");
  return `${base}${pathname}`;
}

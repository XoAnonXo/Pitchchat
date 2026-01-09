import { getPublishedPagesForSitemap } from "@/db/queries";
import { buildAbsoluteUrl, buildSitemapXml, type SitemapUrl } from "@/lib/sitemap";

export async function GET() {
  // Only include published pages with actual DB timestamps
  const publishedPages = await getPublishedPagesForSitemap();

  const urls: SitemapUrl[] = publishedPages.map((page) => ({
    url: buildAbsoluteUrl(page.slug),
    lastModified: page.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const xml = buildSitemapXml(urls);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

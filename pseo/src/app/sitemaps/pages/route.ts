import pilotConfig from "@/data/pilot-config.json";
import { buildAbsoluteUrl, buildSitemapXml } from "@/lib/sitemap";

export function GET() {
  const urls: string[] = [];

  for (const industry of pilotConfig.industries) {
    for (const stage of pilotConfig.stages) {
      for (const pageType of pilotConfig.pageTypes) {
        urls.push(
          buildAbsoluteUrl(
            `/investor-questions/${industry.slug}/${stage.slug}/${pageType.slug}/`
          )
        );
      }
    }
  }

  const xml = buildSitemapXml(urls);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

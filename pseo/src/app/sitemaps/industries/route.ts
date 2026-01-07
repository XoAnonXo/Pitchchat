import pilotConfig from "@/data/pilot-config.json";
import { buildAbsoluteUrl, buildSitemapXml } from "@/lib/sitemap";

export function GET() {
  const urls = pilotConfig.industries.map((industry) =>
    buildAbsoluteUrl(`/investor-questions/industries/${industry.slug}/`)
  );

  const xml = buildSitemapXml(urls);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

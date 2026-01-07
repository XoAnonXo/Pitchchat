import pilotConfig from "@/data/pilot-config.json";
import { buildAbsoluteUrl, buildSitemapXml } from "@/lib/sitemap";

export function GET() {
  const urls = pilotConfig.stages.map((stage) =>
    buildAbsoluteUrl(`/investor-questions/stages/${stage.slug}/`)
  );

  const xml = buildSitemapXml(urls);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

import { getSiteUrl } from "@/lib/site";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

type PseoBreadcrumbSchemaProps = {
  items: BreadcrumbItem[];
};

/**
 * BreadcrumbList schema for pSEO pages
 * Per PRD-03: Enhanced Structured Data for pSEO Pages
 *
 * Renders breadcrumb structured data for rich results in search.
 * Should be included on all pSEO pages with proper hierarchy.
 *
 * Example usage:
 * <PseoBreadcrumbSchema
 *   items={[
 *     { name: "Investor Questions", path: "/" },
 *     { name: "SaaS", path: "/saas" },
 *     { name: "Seed Stage", path: "/saas/seed" },
 *     { name: "Market Size Questions", path: "/saas/seed/market-size" },
 *   ]}
 * />
 */
export function PseoBreadcrumbSchema({ items }: PseoBreadcrumbSchemaProps) {
  const siteUrl = getSiteUrl();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

import { getSiteUrl } from "@/lib/site";

/**
 * Organization schema for Pitchchat - renders globally in layout.tsx
 * Per PRD-03: Enhanced Structured Data for pSEO Pages
 *
 * This schema establishes the brand entity for rich results and
 * is referenced via @id by other schemas (Article, BreadcrumbList, etc.)
 */
export function PseoOrganizationSchema() {
  const siteUrl = getSiteUrl();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Pitchchat",
    url: siteUrl,
    // TODO: Create a static 512x512 PNG logo for better structured data support.
    // For now using SVG which works but PNG is preferred for Google rich results.
    logo: {
      "@type": "ImageObject",
      "@id": `${siteUrl}/#logo`,
      url: `${siteUrl}/logo.svg`,
      width: 100,
      height: 100,
      caption: "Pitchchat Logo",
    },
    description:
      "AI-powered pitch practice and investor Q&A preparation for startup founders raising seed and Series A rounds.",
    sameAs: [
      "https://twitter.com/pitchchat",
      "https://www.linkedin.com/company/pitchchat",
    ],
    foundingDate: "2024",
    slogan: "Practice your pitch. Perfect your answers.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

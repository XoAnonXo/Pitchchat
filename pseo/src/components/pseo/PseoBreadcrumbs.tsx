"use client";

import Link from "next/link";

import { trackLinkClick } from "@/lib/analytics";

function handleBreadcrumbClick(href: string) {
  trackLinkClick(href, "breadcrumb", window.location.pathname);
}

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PseoBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

/**
 * Visual breadcrumb navigation UI component
 * Per PRD-05: Internal Linking & Navigation
 *
 * Renders clickable breadcrumb trail for user navigation.
 * Works alongside PseoBreadcrumbSchema for structured data.
 */
export function PseoBreadcrumbs({ items }: PseoBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb navigation" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-neutral-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="mx-1.5 h-4 w-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-neutral-900 hover:underline focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded px-1"
                onClick={() => handleBreadcrumbClick(item.href!)}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-neutral-900 font-medium px-1"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

"use client";

import Link from "next/link";

import pilotConfig from "@/data/pilot-config.json";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import { trackLinkClick } from "@/lib/analytics";

function handleFooterClick(href: string) {
  trackLinkClick(href, "footer", window.location.pathname);
}

/**
 * Site footer with navigation links
 * Per PRD-05: Internal Linking & Navigation
 *
 * Provides comprehensive internal linking for SEO and user navigation.
 */
export function PseoFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 mt-16">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Industries */}
          <div className="col-span-1">
            <h3 className="font-semibold text-xs md:text-sm text-neutral-900 mb-3 md:mb-4">
              By Industry
            </h3>
            <ul className="space-y-2">
              {pilotConfig.industries.map((industry) => {
                const href = `/investor-questions/industries/${industry.slug}/`;
                return (
                  <li key={industry.slug}>
                    <Link
                      href={href}
                      className="text-xs md:text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:underline"
                      onClick={() => handleFooterClick(href)}
                    >
                      {labelForIndustry(industry.slug)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Stages */}
          <div className="col-span-1">
            <h3 className="font-semibold text-xs md:text-sm text-neutral-900 mb-3 md:mb-4">
              By Stage
            </h3>
            <ul className="space-y-2">
              {pilotConfig.stages.map((stage) => {
                const href = `/investor-questions/stages/${stage.slug}/`;
                return (
                  <li key={stage.slug}>
                    <Link
                      href={href}
                      className="text-xs md:text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:underline"
                      onClick={() => handleFooterClick(href)}
                    >
                      {labelForStage(stage.slug)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-semibold text-xs md:text-sm text-neutral-900 mb-3 md:mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/investor-questions/"
                  className="text-xs md:text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:underline"
                  onClick={() => handleFooterClick("/investor-questions/")}
                >
                  All Investor Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/investor-questions/industries/"
                  className="text-xs md:text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:underline"
                  onClick={() => handleFooterClick("/investor-questions/industries/")}
                >
                  Browse Industries
                </Link>
              </li>
              <li>
                <Link
                  href="/investor-questions/stages/"
                  className="text-xs md:text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:underline"
                  onClick={() => handleFooterClick("/investor-questions/stages/")}
                >
                  Browse Stages
                </Link>
              </li>
            </ul>
          </div>

          {/* Pitchchat */}
          <div className="col-span-1">
            <h3 className="font-semibold text-xs md:text-sm text-neutral-900 mb-3 md:mb-4">
              Pitchchat
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://pitchchat.ai"
                  className="text-xs md:text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:underline"
                >
                  Try Pitchchat
                </a>
              </li>
              <li>
                <a
                  href="https://pitchchat.ai"
                  className="text-xs md:text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:underline"
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 text-center text-xs md:text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} Pitchchat. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

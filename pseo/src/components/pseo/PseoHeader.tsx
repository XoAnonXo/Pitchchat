"use client";

import Link from "next/link";

/**
 * Site header with logo and CTA
 * Per PRD-05: Internal Linking & Navigation
 *
 * Provides consistent navigation and main app access across all pSEO pages.
 */
export function PseoHeader() {
  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-neutral-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/investor-questions/"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded-lg"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base">
              P
            </div>
            <span className="font-semibold text-base md:text-lg text-neutral-900">
              Pitchchat
            </span>
          </Link>

          {/* CTA Button */}
          <a
            href="https://pitchchat.ai"
            className="bg-neutral-900 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
          >
            Try Pitchchat
          </a>
        </div>
      </header>
    </>
  );
}

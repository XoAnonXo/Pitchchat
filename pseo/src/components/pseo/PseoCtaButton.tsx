"use client";

import { useEffect, useMemo, useState } from "react";

import { trackPseoEvent, type PseoAnalyticsContext } from "@/lib/analytics";

type PseoCtaButtonProps = {
  label: string;
  context: PseoAnalyticsContext;
  href?: string;
};

type CtaVariant = "A" | "B";

const VARIANT_STORAGE_KEY = "pseo_cta_variant";
const DEFAULT_ALT_LABEL = "Start your PitchChat room";

function resolveVariant(): CtaVariant {
  if (typeof window === "undefined") {
    return "A";
  }

  const params = new URLSearchParams(window.location.search);
  const paramValue = params.get("cta_variant");
  if (paramValue && (paramValue.toUpperCase() === "A" || paramValue.toUpperCase() === "B")) {
    const normalized = paramValue.toUpperCase() as CtaVariant;
    window.localStorage.setItem(VARIANT_STORAGE_KEY, normalized);
    return normalized;
  }

  const stored = window.localStorage.getItem(VARIANT_STORAGE_KEY);
  if (stored === "A" || stored === "B") {
    return stored;
  }

  const randomVariant: CtaVariant = Math.random() < 0.5 ? "A" : "B";
  window.localStorage.setItem(VARIANT_STORAGE_KEY, randomVariant);
  return randomVariant;
}

function buildCtaHref(href: string, variant: CtaVariant) {
  if (typeof window === "undefined") {
    return href;
  }

  const isAbsolute = /^https?:\/\//i.test(href);
  const url = new URL(href, window.location.origin);

  url.searchParams.set("cta_variant", variant);
  if (!url.searchParams.has("utm_source")) {
    url.searchParams.set("utm_source", "pseo");
  }
  if (!url.searchParams.has("utm_medium")) {
    url.searchParams.set("utm_medium", "cta");
  }
  if (!url.searchParams.has("utm_campaign")) {
    url.searchParams.set("utm_campaign", "investor-questions");
  }
  if (!url.searchParams.has("utm_content")) {
    url.searchParams.set("utm_content", `cta_${variant.toLowerCase()}`);
  }

  return isAbsolute
    ? url.toString()
    : `${url.pathname}${url.search}${url.hash}`;
}

export function PseoCtaButton({ label, context, href }: PseoCtaButtonProps) {
  const targetHref =
    href ?? process.env.NEXT_PUBLIC_SIGNUP_URL ?? "/auth";
  const [variant, setVariant] = useState<CtaVariant>("A");
  const [variantLabel, setVariantLabel] = useState(label);
  const [variantReady, setVariantReady] = useState(false);
  const altLabel = DEFAULT_ALT_LABEL;

  useEffect(() => {
    // We intentionally resolve the CTA variant on the client after mount because it
    // depends on URL params/localStorage. This avoids SSR hydration mismatches.
    const assigned = resolveVariant();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVariant(assigned);
    setVariantLabel(assigned === "B" ? altLabel : label);
    setVariantReady(true);
  }, [label, altLabel]);

  useEffect(() => {
    if (!variantReady) return;
    trackPseoEvent("pseo_signup_cta_view", {
      ...context,
      label: variantLabel,
      variant,
    });
  }, [context, variant, variantLabel, variantReady]);

  const ctaHref = useMemo(
    () => buildCtaHref(targetHref, variant),
    [targetHref, variant]
  );

  return (
    <a
      className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
      href={ctaHref}
      onClick={() =>
        trackPseoEvent("pseo_signup_cta_click", {
          ...context,
          label: variantLabel,
          variant,
        })
      }
    >
      {variantLabel}
    </a>
  );
}

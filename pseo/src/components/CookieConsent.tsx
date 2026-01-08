"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "pitchchat_cookie_consent";

type ConsentStatus = "granted" | "denied" | null;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function updateGtagConsent(status: "granted" | "denied") {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: status,
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
    });
  }
}

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "granted" || stored === "denied") {
      setConsent(stored);
      updateGtagConsent(stored);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    setConsent("granted");
    updateGtagConsent("granted");
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "denied");
    setConsent("denied");
    updateGtagConsent("denied");
  };

  // Don't render on server or if consent already given
  if (!mounted || consent !== null) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-neutral-300">
          We use cookies to analyze traffic and improve your experience.{" "}
          <a
            href="https://pitchchat.ai/privacy"
            className="underline hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-neutral-600 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-800"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

type QuestionCardProps = {
  category: string;
  question: string;
  answer: string;
  industrySlug: string;
  stageSlug: string;
};

export function QuestionCard({
  category,
  question,
  answer,
  industrySlug,
  stageSlug,
}: QuestionCardProps) {
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState<number | null>(null);

  const { trackCopy, trackRating } = useAnalytics({
    industrySlug,
    stageSlug,
  });

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${question}\n\n${answer}`);
      setCopied(true);
      trackCopy(category);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [question, answer, category, trackCopy]);

  const handleRate = useCallback(
    (value: number) => {
      if (rated !== null) return; // Already rated
      setRated(value);
      trackRating(value, category);
    },
    [rated, category, trackRating]
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {category}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-neutral-900">{question}</h3>
      <p className="mt-3 text-sm text-neutral-700">{answer}</p>

      {/* Actions row */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-700"
          aria-label="Copy answer"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Helpful?</span>
          {rated !== null ? (
            <span className="text-xs text-neutral-500">Thanks!</span>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={() => handleRate(5)}
                className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-green-600"
                aria-label="Yes, helpful"
              >
                <ThumbUpIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleRate(1)}
                className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-red-500"
                aria-label="Not helpful"
              >
                <ThumbDownIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple inline icons to avoid external dependencies
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ThumbUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function ThumbDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
    </svg>
  );
}

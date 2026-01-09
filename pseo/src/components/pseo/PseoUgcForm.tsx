"use client";

import { useState, type FormEvent } from "react";

const CATEGORY_OPTIONS = [
  "Problem",
  "Buyer",
  "Moat",
  "Traction",
  "Economics",
  "Roadmap",
  "Risk",
  "Competition",
  "Team",
  "Other",
];

type PseoUgcFormProps = {
  industry: string;
  stage: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const MAX_QUESTION_LENGTH = 500;
const MAX_ANSWER_LENGTH = 1600;
const MAX_EMAIL_LENGTH = 200;

export function PseoUgcForm({ industry, stage }: PseoUgcFormProps) {
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValid =
    question.trim().length >= 10 &&
    answer.trim().length >= 20 &&
    consent &&
    status !== "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) {
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/ugc/investor-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industrySlug: industry,
          stageSlug: stage,
          category,
          question: question.trim(),
          answer: answer.trim(),
          contactEmail: contactEmail.trim() || undefined,
          consent,
          sourceUrl: typeof window === "undefined" ? undefined : window.location.href,
          website,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message =
          typeof payload?.error === "string"
            ? payload.error
            : "Submission failed. Please try again.";
        setErrorMessage(message);
        setStatus("error");
        return;
      }

      setStatus("success");
      setQuestion("");
      setAnswer("");
      setContactEmail("");
      setConsent(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Submission failed. Please try again."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700 shadow-sm">
        Thanks for contributing. Your submission is in review and will be anonymized before
        publishing.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Investor question
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            required
            maxLength={MAX_QUESTION_LENGTH}
            rows={3}
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            placeholder="What question did an investor ask you?"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          How you answered
          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            required
            maxLength={MAX_ANSWER_LENGTH}
            rows={4}
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            placeholder="Share a short, anonymized response."
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Contact email (optional)
          <input
            type="email"
            value={contactEmail}
            maxLength={MAX_EMAIL_LENGTH}
            onChange={(event) => setContactEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            placeholder="name@company.com"
          />
        </label>

        <label className="hidden">
          Website
          <input
            type="text"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            autoComplete="off"
            tabIndex={-1}
          />
        </label>

        <label className="flex items-start gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-neutral-300"
          />
          <span>
            I confirm this is anonymized, contains no confidential details, and can be published
            with attribution removed.
          </span>
        </label>
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!isValid}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {status === "submitting" ? "Submitting..." : "Submit anonymized question"}
      </button>
    </form>
  );
}

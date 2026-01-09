import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Pitchchat - Investor Questions";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const pageTypeLabels: Record<string, string> = {
  "investor-questions": "Investor Questions",
  "pitch-deck": "Pitch Deck Outline",
  "metrics-benchmarks": "Metrics & Benchmarks",
  "diligence-checklist": "Diligence Checklist",
  "investor-update": "Investor Update Template",
};

const industryLabels: Record<string, string> = {
  aerospace: "Aerospace",
  hardware: "Hardware",
  robotics: "Robotics",
  chemistry: "Chemistry",
  finance: "Finance",
  blockchain: "Blockchain",
  ai: "AI",
  saas: "SaaS",
  healthcare: "Healthcare",
  fintech: "Fintech",
};

const stageLabels: Record<string, string> = {
  seed: "Seed",
  "series-a": "Series A",
};

// Color themes per page type for visual differentiation
const pageTypeColors: Record<string, { accent: string; badge: string }> = {
  "investor-questions": { accent: "#67e8f9", badge: "#0891b2" },
  "pitch-deck": { accent: "#a78bfa", badge: "#7c3aed" },
  "metrics-benchmarks": { accent: "#4ade80", badge: "#16a34a" },
  "diligence-checklist": { accent: "#fbbf24", badge: "#d97706" },
  "investor-update": { accent: "#f472b6", badge: "#db2777" },
};

export default async function Image({
  params,
}: {
  params: Promise<{ industry: string; stage: string; pageType: string }>;
}) {
  const { industry, stage, pageType } = await params;

  const industryLabel = industryLabels[industry] ?? industry;
  const stageLabel = stageLabels[stage] ?? stage;
  const pageTypeLabel = pageTypeLabels[pageType] ?? pageType;
  const colors = pageTypeColors[pageType] ?? pageTypeColors["investor-questions"];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1e3a5f 0%, transparent 50%), radial-gradient(circle at 75% 75%, #134e4a 0%, transparent 50%)",
          padding: "60px",
        }}
      >
        {/* Top bar with logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "bold",
              color: "#0f172a",
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: "#ffffff",
            }}
          >
            Pitchchat
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Page type badge */}
          <div
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                padding: "10px 24px",
                backgroundColor: colors.badge,
                borderRadius: "24px",
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {pageTypeLabel}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#ffffff",
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            {industryLabel} {stageLabel}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "28px",
              color: "#94a3b8",
              maxWidth: "800px",
            }}
          >
            Investor-ready guidance for {industryLabel.toLowerCase()} startups
            at the {stageLabel.toLowerCase()} stage
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "4px",
              backgroundColor: colors.accent,
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              color: colors.accent,
            }}
          >
            pitchchat.ai
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

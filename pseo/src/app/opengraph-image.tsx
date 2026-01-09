import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Pitchchat - Investor-ready guidance for founders";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1e3a5f 0%, transparent 50%), radial-gradient(circle at 75% 75%, #134e4a 0%, transparent 50%)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: "bold",
              color: "#0f172a",
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Pitchchat
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Investor-ready guidance for founders raising seed and Series A rounds
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "12px",
          }}
        >
          <div
            style={{
              padding: "8px 20px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "20px",
              color: "#67e8f9",
              fontSize: "18px",
            }}
          >
            Investor Questions
          </div>
          <div
            style={{
              padding: "8px 20px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "20px",
              color: "#67e8f9",
              fontSize: "18px",
            }}
          >
            Pitch Decks
          </div>
          <div
            style={{
              padding: "8px 20px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "20px",
              color: "#67e8f9",
              fontSize: "18px",
            }}
          >
            Metrics
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

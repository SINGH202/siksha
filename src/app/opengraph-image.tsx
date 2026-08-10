import { ImageResponse } from "next/og";

export const alt = "Siksha — Home tuition marketplace in Farrukhabad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #00535b 0%, #006d77 55%, #acedda 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 700 }}>Siksha</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
            Verified home tutors in Farrukhabad
          </div>
          <div style={{ fontSize: 28, opacity: 0.9, maxWidth: 820 }}>
            Classes 8–12 · In-app chat · Teachers respond within 24 hours
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

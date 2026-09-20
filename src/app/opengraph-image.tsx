import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#09090b",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, color: "#a1a1aa" }}>twitterbanner.lol</div>
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 16, lineHeight: 1.1 }}>
          Rent Twitter banners from high-reach creators
        </div>
        <div style={{ marginTop: 24, fontSize: 28, color: "#d4d4d8" }}>1500×500 · weekly rates · creator approval</div>
      </div>
    ),
    size
  );
}

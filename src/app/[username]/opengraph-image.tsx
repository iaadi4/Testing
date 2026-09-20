import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const handle = decodeURIComponent(username).replace(/^@/, "").toLowerCase();
  const creator = await prisma.user.findUnique({
    where: { username: handle },
    select: { username: true, weeklyPrice: true, followersCount: true },
  });
  const name = creator?.username || handle;
  const price = creator?.weeklyPrice ?? 49;
  const followers = creator?.followersCount ?? 0;
  const headline = `Rent @${name}'s banner`;
  const sub = `$${price}/week · ${followers.toLocaleString()} followers`;

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
        <div style={{ fontSize: 60, fontWeight: 800, marginTop: 12 }}>{headline}</div>
        <div style={{ marginTop: 20, fontSize: 30, color: "#d4d4d8" }}>{sub}</div>
      </div>
    ),
    size
  );
}

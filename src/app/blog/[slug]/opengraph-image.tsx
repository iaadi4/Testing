import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
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
        <div style={{ fontSize: 24, color: "#a1a1aa" }}>{post?.tag || "Blog"}</div>
        <div style={{ fontSize: 54, fontWeight: 800, marginTop: 16, lineHeight: 1.15 }}>
          {post?.title || "twitterbanner.lol"}
        </div>
      </div>
    ),
    size
  );
}

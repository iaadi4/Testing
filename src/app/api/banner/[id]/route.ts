import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decodeDataUrl } from "@/lib/security";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sponsorship = await prisma.sponsorship.findUnique({
    where: { id },
    select: { bannerImageUrl: true, updatedAt: true },
  });

  if (!sponsorship?.bannerImageUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const etag = `"${sponsorship.updatedAt.getTime()}"`;
  if (_req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304 });
  }

  const src = sponsorship.bannerImageUrl;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return NextResponse.redirect(new URL(src, _req.url), 302);
  }

  const decoded = decodeDataUrl(src);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid banner" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(decoded.buffer), {
    headers: {
      "Content-Type": decoded.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { markPaidAwaitingApproval, publicOrder } from "@/lib/sponsorships";

export async function POST(req: NextRequest) {
  try {
    const { sponsorshipId } = await req.json();
    if (!sponsorshipId || typeof sponsorshipId !== "string") {
      return NextResponse.json({ error: "Missing sponsorshipId" }, { status: 400 });
    }

    let sponsorship = await prisma.sponsorship.findUnique({
      where: { id: sponsorshipId },
      include: { creator: { select: { username: true } } },
    });

    if (!sponsorship) {
      return NextResponse.json({ error: "Sponsorship not found" }, { status: 404 });
    }

    if (process.env.NODE_ENV !== "production" && sponsorship.status === "PENDING") {
      const updated = await markPaidAwaitingApproval(sponsorship.id, `sim_${Date.now()}`);
      if (updated) {
        sponsorship = {
          ...updated,
          creator: sponsorship.creator,
        };
      }
    }

    return NextResponse.json({
      success: sponsorship.status !== "PENDING",
      ...publicOrder(sponsorship),
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

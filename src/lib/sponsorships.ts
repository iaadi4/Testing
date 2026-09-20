import { prisma } from "@/lib/db";

export function sponsorshipWindow(durationWeeks: number, from = new Date()) {
  const weeks = Math.max(1, durationWeeks || 1);
  return {
    startDate: from,
    endDate: new Date(from.getTime() + weeks * 7 * 24 * 60 * 60 * 1000),
  };
}

export async function markPaidAwaitingApproval(sponsorshipId: string, paymentId?: string, sessionId?: string) {
  const existing = await prisma.sponsorship.findUnique({ where: { id: sponsorshipId } });
  if (!existing) return null;
  if (existing.status !== "PENDING") return existing;

  return prisma.sponsorship.update({
    where: { id: sponsorshipId },
    data: {
      status: "AWAITING_APPROVAL",
      dodoPaymentId: paymentId ? String(paymentId) : existing.dodoPaymentId,
      dodoSessionId: sessionId ? String(sessionId) : existing.dodoSessionId,
    },
  });
}

export async function approveSponsorship(sponsorshipId: string, creatorId: string) {
  const sponsorship = await prisma.sponsorship.findUnique({ where: { id: sponsorshipId } });
  if (!sponsorship || sponsorship.creatorId !== creatorId) return null;
  if (sponsorship.status !== "AWAITING_APPROVAL") return sponsorship;

  const { startDate, endDate } = sponsorshipWindow(sponsorship.durationWeeks);

  await prisma.sponsorship.updateMany({
    where: {
      creatorId,
      status: "ACTIVE",
      id: { not: sponsorshipId },
    },
    data: { status: "COMPLETED" },
  });

  return prisma.sponsorship.update({
    where: { id: sponsorshipId },
    data: {
      status: "ACTIVE",
      startDate,
      endDate,
      approvedAt: new Date(),
      rejectedAt: null,
      refundDue: false,
    },
  });
}

export async function rejectSponsorship(sponsorshipId: string, creatorId: string) {
  const sponsorship = await prisma.sponsorship.findUnique({ where: { id: sponsorshipId } });
  if (!sponsorship || sponsorship.creatorId !== creatorId) return null;
  if (sponsorship.status !== "AWAITING_APPROVAL") return sponsorship;

  return prisma.sponsorship.update({
    where: { id: sponsorshipId },
    data: {
      status: "CANCELLED",
      rejectedAt: new Date(),
      refundDue: true,
    },
  });
}

export function publicOrder(sponsorship: {
  id: string;
  status: string;
  brandName: string;
  brandUrl: string;
  durationWeeks: number;
  amountPaid: number;
  startDate?: Date | null;
  endDate?: Date | null;
  creator?: { username: string } | null;
}) {
  return {
    sponsorshipId: sponsorship.id,
    status: sponsorship.status,
    brandName: sponsorship.brandName,
    brandUrl: sponsorship.brandUrl,
    durationWeeks: sponsorship.durationWeeks,
    amountPaid: sponsorship.amountPaid,
    startDate: sponsorship.startDate,
    endDate: sponsorship.endDate,
    creatorUsername: sponsorship.creator?.username || null,
    hasBanner: true,
  };
}

import { prisma } from "@/lib/db";

export function calculateEndDate(_durationType?: string, startDate: Date = new Date()): Date {
  const end = new Date(startDate);
  // Reign persists indefinitely until dethroned by another contender
  end.setFullYear(end.getFullYear() + 10);
  return end;
}

export async function activateSponsor(sponsorId: string, paymentId?: string | null) {
  const sponsor = await prisma.sponsor.findUnique({
    where: { id: sponsorId },
  });

  if (!sponsor) {
    return null;
  }

  // If already active with this payment ID, return early
  if (sponsor.status === "ACTIVE" && (!paymentId || sponsor.dodoPaymentId === paymentId)) {
    return sponsor;
  }

  const startDate = sponsor.startDate || new Date();
  const endDate = sponsor.endDate || calculateEndDate(sponsor.durationType, startDate);

  const settings = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  // Check current active sponsor to dethrone
  if (settings?.activeSponsorId && settings.activeSponsorId !== sponsor.id) {
    const currentActive = await prisma.sponsor.findUnique({
      where: { id: settings.activeSponsorId },
    });

    if (currentActive && sponsor.amountPaid >= currentActive.amountPaid) {
      await prisma.sponsor.update({
        where: { id: currentActive.id },
        data: {
          isOutbid: true,
          outbidById: sponsor.id,
          status: "EXPIRED",
        },
      });
    }
  }

  const updated = await prisma.sponsor.update({
    where: { id: sponsor.id },
    data: {
      status: "ACTIVE",
      startDate,
      endDate,
      dodoPaymentId: paymentId ? String(paymentId) : sponsor.dodoPaymentId,
    },
  });

  await prisma.siteSetting.update({
    where: { id: "default" },
    data: { activeSponsorId: sponsor.id },
  });

  return updated;
}

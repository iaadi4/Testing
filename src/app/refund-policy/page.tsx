import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Refund Policy",
  "How refunds work when a creator rejects a booking.",
  "/refund-policy",
);

export default function RefundPolicyPage() {
  return (
    <PageShell width="narrow">
      <h1 className="text-3xl font-extrabold">Refund Policy</h1>
      <div className="mt-6 space-y-4 text-sm text-zinc-600 leading-relaxed">
        <p>Payment is captured at checkout and held until the creator approves or rejects the creative.</p>
        <p>If the creator rejects the booking, the order is marked refund-due. Refunds are processed manually through Dodo. Email @iaadi8 on X with the order id if you do not see the refund within 5 business days.</p>
        <p>Approved bookings that have already started are not refundable except when the creator fails to upload the banner after written notice.</p>
      </div>
    </PageShell>
  );
}

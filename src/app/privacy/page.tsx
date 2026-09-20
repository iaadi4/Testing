import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Privacy Policy",
  "How twitterbanner.lol handles account and booking data.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <PageShell width="narrow">
      <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm text-zinc-600 leading-relaxed">
        <p>We collect Twitter profile data you authorize (handle, name, avatar, bio, follower counts), booking details (name, email, brand, destination URL, banner file), and payment references from Dodo. We do not store card numbers.</p>
        <p>Session cookies are httpOnly. Admin sessions last 8 hours. Analytics are provided by Vercel Analytics.</p>
        <p>Banners are stored so we can show the marketplace and fulfill bookings. Click redirects increment a counter and send the visitor to the advertiser URL.</p>
        <p>Contact @iaadi8 on X for deletion requests.</p>
      </div>
    </PageShell>
  );
}

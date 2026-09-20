import { getArenaData } from "@/lib/arena";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is twitterbanner.lol?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "twitterbanner.lol is a pay-to-dethrone Twitter banner sponsorship platform inspired by outbid.lol. Anyone can pay to replace the current banner on @iaadi8\u2019s Twitter/X profile. The concept is simple: outbid the current king to take the throne.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost to sponsor the banner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It starts at just $1. To dethrone the current sponsor, you pay $1 more than what they paid. There are no hidden fees, no subscriptions, and no algorithms — just pure pay-to-rank visibility.",
      },
    },
    {
      "@type": "Question",
      name: "What happens when someone outbids me?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your banner gets replaced by the new sponsor\u2019s banner immediately. You join the \u201CFallen Kings\u201D hall of fame showing your reign duration and the amount you paid. Your brand still gets visibility in the bid history.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from outbid.lol?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "outbid.lol is a pay-to-rank leaderboard directory. twitterbanner.lol takes that same competitive mechanic but anchors it to real social media real estate — a Twitter profile banner that gets organic daily impressions from every profile visitor.",
      },
    },
    {
      "@type": "Question",
      name: "Who sees my banner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Everyone who visits @iaadi8\u2019s Twitter/X profile sees the current sponsor\u2019s banner. This includes organic visitors from tweets, replies, and retweets. It\u2019s direct, algorithmic-free visibility for your brand.",
      },
    },
  ],
};

export default async function HomePage() {
  const initialData = await getArenaData(false);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomeClient initialData={initialData} />
    </>
  );
}

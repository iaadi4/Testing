import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.twitterbanner.lol"),
  title: {
    default: "twitterbanner.lol — Outbid the Twitter Banner on @iaadi8",
    template: "%s | twitterbanner.lol",
  },
  description:
    "Inspired by outbid.lol. Starts at $1. Outbid the current sponsor to replace the Twitter banner on @iaadi8 live. Zero algorithms, pure pay-to-rank visibility.",
  keywords: [
    "twitterbanner.lol",
    "outbid.lol",
    "twitter banner sponsor",
    "x advertising",
    "indie hacker sponsor",
    "pay to dethrone",
    "twitter banner sponsorship",
    "sell twitter banner space",
    "monetize twitter banner",
    "x profile banner sponsor",
    "pay to rank leaderboard",
    "gamified ad space",
    "king of the hill advertising",
    "bannermrr alternative",
  ],
  authors: [{ name: "Aditya (@iaadi8)", url: "https://x.com/iaadi8" }],
  creator: "Aditya (@iaadi8)",
  publisher: "twitterbanner.lol",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "twitterbanner.lol — Outbid the Twitter Banner on @iaadi8",
    description:
      "Starts at $1. Outbid the current sponsor to replace the Twitter banner on @iaadi8 live. Zero algorithms, pure pay-to-rank visibility.",
    url: "https://www.twitterbanner.lol",
    siteName: "twitterbanner.lol",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "twitterbanner.lol — Outbid the Twitter Banner on @iaadi8",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "twitterbanner.lol — Outbid the Twitter Banner on @iaadi8",
    description:
      "Starts at $1. Pay $1 more than the current sponsor to replace the banner on @iaadi8. Inspired by outbid.lol.",
    creator: "@iaadi8",
    site: "@iaadi8",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=5" },
      { url: "/icon.svg?v=5", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=5", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=5", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=5", sizes: "180x180" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "twitterbanner.lol",
  url: "https://www.twitterbanner.lol",
  description:
    "Outbid the current sponsor to replace the Twitter banner on @iaadi8. Inspired by outbid.lol. Zero algorithms, pure pay-to-rank visibility.",
  author: {
    "@type": "Person",
    name: "Aditya",
    url: "https://x.com/iaadi8",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.twitterbanner.lol",
    "query-input": undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#fafafa] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

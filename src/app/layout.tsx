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
    default: "twitterbanner.lol — Rent Twitter Banners from Top Creators",
    template: "%s | twitterbanner.lol",
  },
  description:
    "The two-sided marketplace to rent Twitter/X profile banner real estate from verified high-reach creators. Set your weekly rate, get sponsored, or advertise directly on X.",
  keywords: [
    "twitter banner marketplace",
    "rent twitter banner",
    "buy twitter header ad",
    "monetize twitter profile",
    "x banner sponsor",
    "sell twitter banner space",
    "bannermrr alternative",
    "subheaderx alternative",
    "twitter advertising",
    "indie hacker sponsorships",
    "creator monetization",
    "twitter banner ads",
    "pay for twitter banner",
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
    title: "twitterbanner.lol — Rent Twitter Banners from Top Creators",
    description:
      "Rent verified Twitter/X profile banners for 1 week from high-reach creators. 100% direct visibility with zero algorithmic decay.",
    url: "https://www.twitterbanner.lol",
    siteName: "twitterbanner.lol",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "twitterbanner.lol — The Twitter Banner Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "twitterbanner.lol — Rent Twitter Banners from Top Creators",
    description:
      "Book 1500×500 Twitter profile banners for 1 week directly from verified creators. Zero algorithmic decay.",
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
    "The two-sided marketplace to rent Twitter/X profile banner real estate from verified high-reach creators. Set your weekly rate, get sponsored, or advertise directly on X.",
  author: {
    "@type": "Person",
    name: "Aditya",
    url: "https://x.com/iaadi8",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.twitterbanner.lol?search={search_term_string}",
    "query-input": "required name=search_term_string",
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

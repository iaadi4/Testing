import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { headers } from "next/headers";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { jsonLdScript, organizationLd, webAppLd, websiteLd } from "@/lib/jsonld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "twitterbanner.lol — Rent Twitter Banners from Top Creators",
    template: "%s | twitterbanner.lol",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "twitter banner marketplace",
    "rent twitter banner",
    "buy twitter header ad",
    "monetize twitter profile",
    "x banner sponsor",
    "sell twitter banner space",
    "twitter advertising",
    "creator monetization",
  ],
  authors: [{ name: "Aditya (@iaadi8)", url: "https://x.com/iaadi8" }],
  creator: "Aditya (@iaadi8)",
  publisher: SITE_NAME,
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
    languages: {
      en: SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    title: "twitterbanner.lol — Rent Twitter Banners from Top Creators",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "twitterbanner.lol — Rent Twitter Banners from Top Creators",
    description: SITE_DESCRIPTION,
    creator: "@iaadi8",
    site: "@iaadi8",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#fafafa] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white antialiased">
        <script {...jsonLdScript(organizationLd, nonce)} />
        <script {...jsonLdScript(webAppLd, nonce)} />
        <script {...jsonLdScript(websiteLd, nonce)} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

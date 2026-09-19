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
  title: "twitterbanner.lol — Outbid the Twitter Banner on @iaadi8",
  description:
    "Inspired by outbid.lol. Starts at $1. Outbid the current sponsor to replace the Twitter banner on @iaadi8 live. Zero algorithms, pure pay-to-rank visibility.",
  keywords: [
    "twitterbanner.lol",
    "outbid.lol",
    "twitter banner sponsor",
    "x advertising",
    "indie hacker sponsor",
    "dodo payments",
  ],
  authors: [{ name: "Aditya (@iaadi8)", url: "https://x.com/iaadi8" }],
  openGraph: {
    title: "twitterbanner.lol — Outbid the Twitter Banner on @iaadi8",
    description: "Inspired by outbid.lol. Starts at $1. Outbid the current sponsor to replace the Twitter banner on @iaadi8 live.",
    url: "https://twitterbanner.lol",
    siteName: "twitterbanner.lol",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}

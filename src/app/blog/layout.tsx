import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] flex flex-col font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <Navbar />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

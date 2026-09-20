import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Booking received",
  robots: { index: false, follow: false },
};

export default function SponsorSuccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">{children}</main>
      <Footer />
    </div>
  );
}

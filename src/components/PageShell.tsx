import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function PageShell({
  children,
  width = "default",
}: {
  children: React.ReactNode;
  width?: "default" | "narrow" | "wide";
}) {
  const max = width === "narrow" ? "max-w-3xl" : width === "wide" ? "max-w-5xl" : "max-w-4xl";
  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />
      <main className={`flex-1 ${max} mx-auto w-full px-4 sm:px-6 py-8 sm:py-12`}>{children}</main>
      <Footer />
    </div>
  );
}

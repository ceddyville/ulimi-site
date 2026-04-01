import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Browse — Ulimi",
  description: "Explore African words by category, language, or country.",
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="max-w-[900px] mx-auto px-5 pt-10 pb-20 flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

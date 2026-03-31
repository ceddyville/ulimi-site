import { getConcept } from "@/lib/api";
import type { Metadata } from "next";
import Link from "next/link";
import WordDetail from "./WordDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const concept = await getConcept(slug);
    return {
      title: `${concept.english_term} — Ulimi`,
      description: `"${concept.english_term}" in ${concept.translation_count} African language${concept.translation_count !== 1 ? "s" : ""}. ${concept.precolonial_context || ""}`.trim(),
    };
  } catch {
    return { title: "Word not found — Ulimi" };
  }
}

export default async function WordPage({ params }: Props) {
  const { slug } = await params;

  let concept;
  try {
    concept = await getConcept(slug);
  } catch {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-bold text-ink mb-3">
          Word not found
        </h1>
        <p className="text-ink3 text-sm mb-6">
          The concept &ldquo;{slug}&rdquo; doesn&apos;t exist in the dictionary yet.
        </p>
        <Link
          href="/"
          className="text-sm font-medium text-ochre-d border border-border2 px-5 py-2.5 rounded hover:bg-ochre/[0.07] transition-all"
        >
          ← Back to dictionary
        </Link>
      </div>
    );
  }

  return <WordDetail concept={concept} />;
}

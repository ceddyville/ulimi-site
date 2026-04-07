"use client";

import Link from "next/link";
import type { ConceptDetail } from "@/lib/types";

interface ResultCardProps {
  concept: ConceptDetail;
  searchedWord?: string;
}

export default function ResultCard({ concept, searchedWord }: ResultCardProps) {
  const preview = concept.translations.slice(0, 4);
  const remaining = concept.translation_count - preview.length;

  const href = searchedWord
    ? `/words/${concept.slug}?word=${encodeURIComponent(searchedWord)}`
    : `/words/${concept.slug}`;

  return (
    <Link
      href={href}
      className="block bg-cream border border-border rounded-[10px] overflow-hidden hover:border-border2 transition-colors group no-underline"
    >
      {/* Header */}
      <div className="bg-ink px-[22px] py-4 flex items-baseline gap-3.5 group-hover:bg-ink2 transition-colors">
        <span className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-cream">
          {concept.english_term}
        </span>
        <span className="text-[12px] text-cream/45">
          {concept.translation_count} language{concept.translation_count !== 1 ? "s" : ""}
        </span>
        <span className="ml-auto text-[10px] bg-cream/[0.08] text-ochre-l px-2.5 py-0.5 rounded-[3px] tracking-[0.07em] uppercase">
          {concept.category}
        </span>
      </div>

      {/* Word previews */}
      {preview.length > 0 && (
        <div className="px-[22px] py-3.5 flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
          {preview.map((t) => (
            <span key={t.id} className="inline-flex items-baseline gap-1.5">
              <span className="text-[10px] text-ink3 tracking-[0.06em] uppercase">{t.languages.map(l => l.name).join(", ")}</span>
              <span className="font-[family-name:var(--font-cormorant)] text-[19px] font-semibold text-ink">{t.word}</span>
            </span>
          ))}
          {remaining > 0 && (
            <span className="text-[12px] text-ink3 italic">+{remaining} more</span>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="px-[22px] py-2.5 border-t border-border bg-ochre/[0.03] flex items-center justify-between">
        <span className="text-[12px] text-ink3">
          Click to see all translations, phonetics &amp; cultural notes
        </span>
        <span className="text-[12px] font-medium text-ochre-d group-hover:text-ochre transition-colors">
          Explore →
        </span>
      </div>
    </Link>
  );
}

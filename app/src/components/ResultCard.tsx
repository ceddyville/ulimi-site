"use client";

import type { ConceptDetail } from "@/lib/types";

interface ResultCardProps {
  concept: ConceptDetail;
  onAddTranslation: (concept: ConceptDetail) => void;
  onCorrect: (concept: ConceptDetail, langName: string, word: string) => void;
}

export default function ResultCard({ concept, onAddTranslation, onCorrect }: ResultCardProps) {
  return (
    <div className="bg-cream border border-border rounded-[10px] overflow-hidden">
      {/* Header */}
      <div className="bg-ink px-[22px] py-4 flex items-baseline gap-3.5">
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

      {/* Pre-colonial context */}
      {concept.precolonial_context && (
        <div className="bg-ochre/[0.07] border-b border-border2 px-[22px] py-[11px] text-[12px] text-ochre-d leading-[1.55] italic">
          &ldquo;{concept.precolonial_context}&rdquo;
        </div>
      )}

      {/* Language grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))]">
        {concept.translations.map((t) => (
          <div
            key={t.id}
            className="relative group px-[22px] py-[15px] border-r border-b border-border"
          >
            <div className="text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">
              {t.language.name}
            </div>
            <div className="font-[family-name:var(--font-cormorant)] text-[22px] font-semibold text-ink">
              {t.word}
            </div>
            {t.cultural_note && (
              <div className="text-[11px] text-ink3 mt-[3px] leading-[1.4] italic">
                {t.cultural_note}
              </div>
            )}
            <button
              onClick={() => onCorrect(concept, t.language.name, t.word)}
              className="absolute top-2 right-2 text-[10px] text-ink3 bg-bg2 border border-border rounded-[3px] px-[7px] py-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-[family-name:var(--font-jost)] hover:text-ochre-d hover:border-border2"
            >
              Correct
            </button>
          </div>
        ))}
      </div>

      {/* Add translation bar */}
      <div className="flex items-center justify-between px-[22px] py-3 border-t border-border bg-ochre/[0.03]">
        <span className="text-[12px] text-ink3 italic">
          Know <strong className="text-ink2 not-italic font-medium">{concept.english_term}</strong> in another language?
        </span>
        <button
          onClick={() => onAddTranslation(concept)}
          className="text-[12px] font-medium text-ochre-d bg-transparent border border-border2 px-4 py-[7px] rounded cursor-pointer font-[family-name:var(--font-jost)] transition-all hover:bg-ochre/[0.07] hover:border-ochre"
        >
          + Add translation
        </button>
      </div>
    </div>
  );
}

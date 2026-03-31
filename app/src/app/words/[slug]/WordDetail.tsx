"use client";

import { useState } from "react";
import Link from "next/link";
import type { ConceptDetail } from "@/lib/types";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContributeModal from "@/components/ContributeModal";

interface Props {
  concept: ConceptDetail;
}

export default function WordDetail({ concept }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"new_translation" | "correction">("new_translation");
  const [prefill, setPrefill] = useState<{
    conceptTerm?: string;
    conceptId?: string;
    langName?: string;
    word?: string;
  }>({});

  function openAddTranslation() {
    setModalType("new_translation");
    setPrefill({ conceptTerm: concept.english_term, conceptId: concept.id });
    setModalOpen(true);
  }

  function openCorrection(langName: string, word: string) {
    setModalType("correction");
    setPrefill({ conceptTerm: concept.english_term, conceptId: concept.id, langName, word });
    setModalOpen(true);
  }

  return (
    <>
      <Nav />

      <main className="max-w-[900px] mx-auto px-5 pt-10 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-ink3 mb-8">
          <Link href="/" className="hover:text-ochre-d transition-colors">Dictionary</Link>
          <span className="text-ink3/40">/</span>
          <span className="text-ink2">{concept.english_term}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-bold text-ink leading-tight">
              {concept.english_term}
            </h1>
            <span className="text-[11px] bg-ochre/[0.1] text-ochre-d px-2.5 py-0.5 rounded-[3px] tracking-[0.07em] uppercase font-medium">
              {concept.category}
            </span>
          </div>
          <p className="text-[14px] text-ink3">
            {concept.translation_count} translation{concept.translation_count !== 1 ? "s" : ""} across African languages
            {concept.verified && (
              <span className="ml-2 text-[11px] text-forest font-medium">✓ Verified</span>
            )}
          </p>
        </div>

        {/* Pre-colonial context */}
        {concept.precolonial_context && (
          <div className="bg-ochre/[0.06] border-l-[3px] border-ochre rounded-r-lg px-5 py-4 mb-10">
            <div className="text-[10px] font-medium text-ochre-d tracking-[0.1em] uppercase mb-1.5">
              Pre-colonial context
            </div>
            <p className="text-[14px] text-ink2 leading-relaxed italic">
              &ldquo;{concept.precolonial_context}&rdquo;
            </p>
          </div>
        )}

        {/* Translations */}
        <div className="mb-10">
          <h2 className="text-[11px] font-medium text-ink3 tracking-[0.1em] uppercase mb-4">
            Translations
          </h2>

          {concept.translations.length === 0 ? (
            <div className="bg-cream border border-border rounded-lg px-6 py-8 text-center">
              <p className="text-ink3 text-[14px] mb-4">
                No translations yet. Be the first to contribute one.
              </p>
              <button
                onClick={openAddTranslation}
                className="text-[12px] font-medium text-ochre-d border border-border2 px-5 py-2.5 rounded cursor-pointer font-[family-name:var(--font-jost)] hover:bg-ochre/[0.07] transition-all"
              >
                + Add translation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 bg-cream border border-border rounded-lg overflow-hidden">
              {concept.translations.map((t) => (
                <div
                  key={t.id}
                  className="relative group px-5 py-4 border-r border-b border-border last:border-b-0"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase">
                      {t.language.name}
                    </span>
                    {t.is_precolonial && (
                      <span className="text-[9px] bg-forest/[0.08] text-forest px-1.5 py-px rounded tracking-[0.05em]">
                        pre-colonial
                      </span>
                    )}
                  </div>

                  <div className="font-[family-name:var(--font-cormorant)] text-[26px] font-semibold text-ink leading-tight">
                    {t.word}
                  </div>

                  {t.phonetic && (
                    <div className="text-[12px] text-ink3 mt-1 font-[family-name:var(--font-dm-mono)]">
                      /{t.phonetic}/
                    </div>
                  )}

                  {t.cultural_note && (
                    <div className="text-[11px] text-ink3 mt-2 leading-relaxed italic">
                      {t.cultural_note}
                    </div>
                  )}

                  {t.ethnic_group && (
                    <div className="text-[10px] text-ink3/70 mt-1.5">
                      {t.ethnic_group.name} · {t.ethnic_group.country_iso2}
                    </div>
                  )}

                  <button
                    onClick={() => openCorrection(t.language.name, t.word)}
                    className="absolute top-3 right-3 text-[10px] text-ink3 bg-bg2 border border-border rounded-[3px] px-[7px] py-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-[family-name:var(--font-jost)] hover:text-ochre-d hover:border-border2"
                  >
                    Correct
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add translation CTA */}
        <div className="flex items-center justify-between bg-ochre/[0.04] border border-border rounded-lg px-5 py-4">
          <span className="text-[13px] text-ink3">
            Know <strong className="text-ink2 font-medium">{concept.english_term}</strong> in another language?
          </span>
          <button
            onClick={openAddTranslation}
            className="text-[12px] font-medium text-cream bg-ink border-none px-5 py-2.5 rounded cursor-pointer font-[family-name:var(--font-jost)] tracking-[0.05em] uppercase hover:bg-ochre-d transition-colors"
          >
            + Add translation
          </button>
        </div>
      </main>

      <Footer />

      <ContributeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialType={modalType}
        prefill={prefill}
      />
    </>
  );
}

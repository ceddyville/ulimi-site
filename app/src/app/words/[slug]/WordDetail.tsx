"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ConceptDetail, ConceptListItem, LanguageWithCount, TranslationWithConcept } from "@/lib/types";
import { searchConcepts } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContributeModal from "@/components/ContributeModal";

const CATEGORY_LABELS: Record<string, string> = {
  animals: "Animals",
  food: "Food & Plants",
  nature: "Nature",
  family: "Family & Social",
  culture: "Culture & Governance",
  body: "Body & Health",
  spiritual: "Spiritual & Ceremonial",
  tools: "Tools & Technology",
  geography: "Geography & Place",
  other: "Other",
};

interface Props {
  concept: ConceptDetail;
  similarWords: ConceptListItem[];
  featuredLang?: LanguageWithCount | null;
  moreInLanguage?: TranslationWithConcept[];
}

export default function WordDetail({ concept, similarWords, featuredLang, moreInLanguage = [] }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"new_translation" | "correction">("new_translation");
  const [prefill, setPrefill] = useState<{
    conceptTerm?: string;
    conceptId?: string;
    langName?: string;
    word?: string;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");

  // If a language is featured, find that translation and separate it from the rest
  const featuredTranslation = featuredLang
    ? concept.translations.find((t) => t.language.code === featuredLang.code) ?? null
    : null;
  const otherTranslations = featuredTranslation
    ? concept.translations.filter((t) => t.id !== featuredTranslation.id)
    : concept.translations;

  const handleSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    try {
      const results = await searchConcepts(trimmed);
      if (results.length === 1) {
        router.push(`/words/${results[0].slug}`);
      } else if (results.length > 1) {
        router.push(`/?q=${encodeURIComponent(trimmed)}#search`);
      } else {
        router.push(`/?q=${encodeURIComponent(trimmed)}#search`);
      }
    } catch {
      router.push(`/?q=${encodeURIComponent(trimmed)}#search`);
    }
  }, [router]);

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
        <div className="flex items-center gap-2 text-[12px] text-ink3 mb-5">
          <Link href="/" className="hover:text-ochre-d transition-colors">Dictionary</Link>
          <span className="text-ink3/40">/</span>
          {featuredLang ? (
            <>
              <Link href="/browse/languages" className="hover:text-ochre-d transition-colors">Languages</Link>
              <span className="text-ink3/40">/</span>
              <Link href={`/browse/languages/${featuredLang.code}`} className="hover:text-ochre-d transition-colors">{featuredLang.name}</Link>
              <span className="text-ink3/40">/</span>
              <span className="text-ink2">{featuredTranslation?.word ?? concept.english_term}</span>
            </>
          ) : (
            <span className="text-ink2">{concept.english_term}</span>
          )}
        </div>

        {/* Search another word */}
        <div className="flex gap-2.5 mb-8">
          <input
            type="text"
            className="flex-1 bg-cream border border-border rounded px-[18px] py-[11px] text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3"
            placeholder="Search another word — simba, ubuntu, mama…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(searchQuery);
            }}
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            className="bg-ink text-cream px-5 py-[11px] rounded text-[12px] font-medium tracking-[0.06em] uppercase cursor-pointer font-[family-name:var(--font-jost)] transition-colors hover:bg-ochre-d"
          >
            Search
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          {featuredTranslation ? (
            <>
              <div className="flex items-baseline gap-3 mb-1">
                <h1 className="font-[family-name:var(--font-cormorant)] text-[48px] font-bold text-ink leading-tight">
                  {featuredTranslation.word}
                </h1>
                <Link
                  href={`/browse/languages/${featuredLang!.code}`}
                  className="text-[11px] bg-ochre/[0.1] text-ochre-d px-2.5 py-0.5 rounded-[3px] tracking-[0.07em] uppercase font-medium no-underline hover:bg-ochre/[0.2] transition-colors"
                >
                  {featuredLang!.name}
                </Link>
              </div>
              {featuredTranslation.phonetic && (
                <div className="text-[14px] text-ink3 font-[family-name:var(--font-dm-mono)] mb-1">
                  /{featuredTranslation.phonetic}/
                </div>
              )}
              <p className="text-[16px] text-ink2 mb-1">
                English: <strong className="font-medium">{concept.english_term}</strong>
                {concept.definition && (
                  <span className="text-ink3"> — {concept.definition}</span>
                )}
              </p>
              {featuredTranslation.cultural_note && (
                <p className="text-[13px] text-ink3 italic">{featuredTranslation.cultural_note}</p>
              )}
              {featuredTranslation.ethnic_group && (
                <p className="text-[12px] text-ink3/70 mt-1">
                  {featuredTranslation.ethnic_group.name} · {featuredTranslation.ethnic_group.country_iso2}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <Link
                  href={`/browse/categories/${concept.category}`}
                  className="text-[11px] bg-ochre/[0.1] text-ochre-d px-2.5 py-0.5 rounded-[3px] tracking-[0.07em] uppercase font-medium no-underline hover:bg-ochre/[0.2] transition-colors"
                >
                  {concept.category}
                </Link>
                <span className="text-[13px] text-ink3">
                  {concept.translation_count} translation{concept.translation_count !== 1 ? "s" : ""} across African languages
                </span>
                {concept.verified && (
                  <span className="text-[11px] text-forest font-medium">✓ Verified</span>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-3 mb-2">
                <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-bold text-ink leading-tight">
                  {concept.english_term}
                </h1>
                <Link
                  href={`/browse/categories/${concept.category}`}
                  className="text-[11px] bg-ochre/[0.1] text-ochre-d px-2.5 py-0.5 rounded-[3px] tracking-[0.07em] uppercase font-medium no-underline hover:bg-ochre/[0.2] transition-colors"
                >
                  {concept.category}
                </Link>
              </div>
              {concept.definition && (
                <p className="text-[14px] text-ink2 mb-1">{concept.definition}</p>
              )}
              <p className="text-[14px] text-ink3">
                {concept.translation_count} translation{concept.translation_count !== 1 ? "s" : ""} across African languages
                {concept.verified && (
                  <span className="ml-2 text-[11px] text-forest font-medium">✓ Verified</span>
                )}
              </p>
            </>
          )}
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
            {featuredLang ? "In other languages" : "Translations"}
          </h2>

          {otherTranslations.length === 0 ? (
            <div className="bg-cream border border-border rounded-lg px-6 py-8 text-center">
              <p className="text-ink3 text-[14px] mb-4">
                {featuredLang
                  ? `No other translations yet. Be the first to contribute one.`
                  : `No translations yet. Be the first to contribute one.`}
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
              {otherTranslations.map((t) => (
                <div
                  key={t.id}
                  className="relative group px-5 py-4 border-r border-b border-border last:border-b-0"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Link
                      href={`/browse/languages/${t.language.code}`}
                      className="text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase no-underline hover:text-ochre-d transition-colors"
                    >
                      {t.language.name}
                    </Link>
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

        {/* More in [Language] — only when coming from a language page */}
        {featuredLang && moreInLanguage.length > 0 && (
          <div className="mt-10">
            <h2 className="text-[11px] font-medium text-ink3 tracking-[0.1em] uppercase mb-4">
              More {CATEGORY_LABELS[concept.category] ?? concept.category} in{" "}
              <Link
                href={`/browse/languages/${featuredLang.code}`}
                className="text-ochre-d no-underline hover:text-ochre transition-colors"
              >
                {featuredLang.name}
              </Link>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 bg-cream border border-border rounded-lg overflow-hidden">
              {moreInLanguage.map((t) => (
                <Link
                  key={t.id}
                  href={`/words/${t.concept_slug}?lang=${featuredLang.code}`}
                  className="block px-4 py-3.5 border-r border-b border-border hover:bg-ochre/[0.03] transition-colors group no-underline"
                >
                  <div className="font-[family-name:var(--font-cormorant)] text-[20px] font-semibold text-ink group-hover:text-ochre-d transition-colors leading-tight">
                    {t.word}
                  </div>
                  <div className="text-[11px] text-ink3 mt-0.5">
                    {t.concept_term}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Similar words from same category */}
        {similarWords.length > 0 && (
          <div className="mt-10">
            <h2 className="text-[11px] font-medium text-ink3 tracking-[0.1em] uppercase mb-4">
              More in{" "}
              <Link
                href={`/browse/categories/${concept.category}`}
                className="text-ochre-d no-underline hover:text-ochre transition-colors"
              >
                {concept.category}
              </Link>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 bg-cream border border-border rounded-lg overflow-hidden">
              {similarWords.map((w) => (
                <Link
                  key={w.id}
                  href={`/words/${w.slug}`}
                  className="block px-4 py-3.5 border-r border-b border-border hover:bg-ochre/[0.03] transition-colors group no-underline"
                >
                  <div className="font-[family-name:var(--font-cormorant)] text-[20px] font-semibold text-ink group-hover:text-ochre-d transition-colors leading-tight">
                    {w.english_term}
                  </div>
                  <div className="text-[11px] text-ink3 mt-0.5">
                    {w.translation_count} translation{w.translation_count !== 1 ? "s" : ""}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
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

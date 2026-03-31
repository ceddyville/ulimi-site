"use client";

import { useState, useCallback } from "react";
import type { ConceptDetail, ContributionType } from "@/lib/types";
import { searchConcepts } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import NoResult from "@/components/NoResult";
import ContributeModal from "@/components/ContributeModal";

export default function HomePage() {
  const [results, setResults] = useState<ConceptDetail[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ContributionType>("new_concept");
  const [modalPrefill, setModalPrefill] = useState<{
    conceptTerm?: string;
    conceptId?: string;
    langName?: string;
    word?: string;
    translationId?: string;
  }>({});

  const handleSearch = useCallback(async (query: string) => {
    setLastQuery(query);
    setSearched(true);
    setLoading(true);
    try {
      const data = await searchConcepts(query);
      setResults(data.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const openModal = useCallback(
    (type: ContributionType, prefill: typeof modalPrefill = {}) => {
      setModalType(type);
      setModalPrefill(prefill);
      setModalOpen(true);
    },
    []
  );

  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="max-w-[1100px] mx-auto px-12 pt-[90px] pb-[70px] grid grid-cols-1 md:grid-cols-2 gap-[70px] items-center animate-[fadeUp_0.6s_ease_both]">
        <div>
          <div className="inline-flex items-center gap-2.5 text-[10px] font-medium tracking-[0.16em] text-ochre-d uppercase mb-[22px]">
            <span className="w-7 h-px bg-ochre" />
            Trans-African Dictionary
          </div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-[clamp(46px,5.5vw,72px)] font-bold leading-[1.02] tracking-[-0.5px] mb-[22px]">
            Words that<br />predate <em className="italic text-ochre">borders</em>
          </h1>
          <p className="font-[family-name:var(--font-cormorant)] text-[20px] font-semibold text-ink leading-[1.4] mb-3.5">
            Google Translate tells you the word.<br />
            Ulimi tells you the <em className="italic text-ochre font-semibold">story</em> behind it.
          </p>
          <p className="text-[15px] text-ink3 max-w-[420px] mb-[38px] font-light leading-[1.75]">
            Search in any African language, receive answers from all of them — with the{" "}
            <strong className="text-ink2 font-medium">pre-colonial context</strong> that colonial dictionaries erased.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <a href="#search" className="bg-ink text-cream px-7 py-[13px] rounded text-[13px] font-medium no-underline tracking-[0.05em] uppercase transition-colors hover:bg-ochre-d">
              Explore the dictionary
            </a>
            <a href="/docs" className="bg-transparent text-ink2 px-5 py-[13px] rounded text-[12px] no-underline border border-border2 font-[family-name:var(--font-dm-mono)] transition-all hover:border-ochre hover:text-ochre-d">
              ulimi.dev/api/v1/
            </a>
          </div>
        </div>

        {/* Hero card — static preview */}
        <div className="bg-cream border border-border rounded-[14px] overflow-hidden shadow-[6px_12px_40px_rgba(44,24,16,0.1)]">
          <div className="bg-ink px-[22px] py-[18px] flex items-center gap-2.5">
            <span className="font-[family-name:var(--font-cormorant)] text-[22px] font-semibold text-cream flex-1">Rain</span>
            <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-ochre-l border border-ochre-l/35 px-2.5 py-[3px] rounded-[3px]">Nature</span>
          </div>
          {[
            { lang: "Swahili", word: "Mvua", note: "" },
            { lang: "Zulu", word: "Imvula", note: "sacred at royal kraal" },
            { lang: "Luo", word: "Koth", note: "rainmaker: Onjinjo" },
            { lang: "Kikuyu", word: "Mũũgũ", note: "prayers to Ngai" },
            { lang: "Hausa", word: "Ruwa", note: "also means water" },
          ].map((row, i, arr) => (
            <div key={row.lang} className={`flex items-baseline justify-between px-[22px] py-[13px] ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-[11px] text-ink3 w-[72px] font-medium tracking-[0.04em] shrink-0">{row.lang}</span>
              <span className="font-[family-name:var(--font-cormorant)] text-[21px] font-semibold text-ink flex-1">{row.word}</span>
              <span className="text-[11px] text-ink3 text-right italic max-w-[130px]">{row.note}</span>
            </div>
          ))}
          <div className="bg-ochre/[0.07] border-t border-border2 px-[22px] py-[13px] text-[12px] text-ochre-d leading-[1.55] italic">
            &ldquo;Rain ceremonies and rainmakers were central to pre-colonial governance across the continent.&rdquo;
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1000px] mx-auto px-12 flex items-center gap-5 mb-14">
        <div className="flex-1 h-px bg-border" />
        <div className="w-2 h-2 bg-ochre rounded-[1px] rotate-45 shrink-0" />
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 max-w-[1000px] mx-auto mb-[60px] px-12 gap-px bg-border border border-border rounded-lg overflow-hidden animate-[fadeUp_0.6s_0.1s_ease_both]">
        {[
          { num: "40+", label: "Languages" },
          { num: "500+", label: "Concepts" },
          { num: "54", label: "Countries" },
          { num: "100%", label: "Open source" },
        ].map((s) => (
          <div key={s.label} className="bg-cream px-[22px] py-[30px] text-center">
            <div className="font-[family-name:var(--font-cormorant)] text-[44px] font-bold text-ink leading-none">{s.num}</div>
            <div className="text-[11px] text-ink3 mt-1.5 tracking-[0.07em] uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search section */}
      <section className="max-w-[1000px] mx-auto mb-[60px] px-12 animate-[fadeUp_0.6s_0.15s_ease_both]" id="search">
        <div className="font-[family-name:var(--font-cormorant)] text-[32px] font-bold mb-1">Try the dictionary</div>
        <div className="text-[13px] text-ink3 mb-[22px]">
          Search in English or any African language — simba, ubuntu, mama, mvua, ibhubesi…
        </div>
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} defaultValue="lion" />
        </div>

        {loading && (
          <div className="text-center py-8 text-ink3 text-[14px]">Searching…</div>
        )}

        {!loading && searched && results.length === 0 && (
          <NoResult query={lastQuery} onAddConcept={(term) => openModal("new_concept", { conceptTerm: term })} />
        )}

        {!loading &&
          results.map((concept) => (
            <div key={concept.id} className="mb-4">
              <ResultCard
                concept={concept}
                onAddTranslation={(c) =>
                  openModal("new_translation", {
                    conceptTerm: c.english_term,
                    conceptId: c.id,
                  })
                }
                onCorrect={(c, langName, w) =>
                  openModal("correction", {
                    conceptTerm: c.english_term,
                    conceptId: c.id,
                    langName,
                    word: w,
                  })
                }
              />
            </div>
          ))}
      </section>

      {/* Features */}
      <section className="max-w-[1000px] mx-auto mb-[60px] px-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border rounded-[10px] overflow-hidden">
        {[
          { num: "01", title: "Bidirectional search", desc: "Search \u201clion\u201d or search \u201csimba\u201d \u2014 either direction returns the same concept with all its translations across every language in the database." },
          { num: "02", title: "Pre-colonial context", desc: "Every entry carries the story of what a word meant before colonisation \u2014 recovering the names and meanings that existed long before European naming systems arrived.", accent: true },
          { num: "03", title: "Community contributed", desc: "Native speakers, scholars, and elders submit words and corrections. Every contribution goes through admin review before going live. The dictionary grows with the community." },
          { num: "04", title: "Kabila API linked", desc: "Each translation connects to its ethnic group \u2014 linking language to clan, kingdom, and cultural lineage across the continent." },
        ].map((f) => (
          <div key={f.num} className={`bg-cream p-[34px] ${f.accent ? "bg-ochre/[0.04] border-l-[3px] border-l-ochre" : ""}`}>
            <div className="font-[family-name:var(--font-cormorant)] text-[52px] font-bold text-surface2 leading-none mb-3.5">{f.num}</div>
            <div className="text-[16px] font-medium text-ink mb-2.5">{f.title}</div>
            <div className="text-[13px] text-ink3 leading-[1.75]">{f.desc}</div>
          </div>
        ))}
      </section>

      {/* Contribute CTA */}
      <section className="max-w-[1000px] mx-auto mb-[60px] px-12" id="contribute">
        <div className="bg-ink rounded-xl p-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <div className="text-[10px] font-medium tracking-[0.14em] text-ochre-l uppercase mb-3">Community</div>
            <div className="font-[family-name:var(--font-cormorant)] text-[34px] font-bold text-cream leading-[1.15] mb-3.5">
              Your language<br />belongs <em className="italic text-ochre-l">here</em>
            </div>
            <p className="text-[14px] text-cream/60 leading-[1.7] max-w-[480px]">
              Native speakers, elders, and scholars — you hold knowledge no API has yet captured. Every word you add carries your culture forward. Contributions are reviewed and credited.
            </p>
          </div>
          <button
            onClick={() => openModal("new_concept")}
            className="bg-ochre text-ink px-[30px] py-3.5 rounded text-[13px] font-medium tracking-[0.05em] uppercase whitespace-nowrap cursor-pointer border-none font-[family-name:var(--font-jost)] transition-colors hover:bg-ochre-l"
          >
            Add a word →
          </button>
        </div>
      </section>

      <Footer />

      <ContributeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialType={modalType}
        prefill={modalPrefill}
      />
    </>
  );
}

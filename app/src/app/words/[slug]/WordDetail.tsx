"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ConceptDetail, ConceptListItem, ContributionType, LanguageWithCount, TranslationWithConcept, Translation } from "@/lib/types";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ContributeModal from "@/components/ContributeModal";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  patchConcept,
  deleteConcept,
  patchTranslation,
  createTranslation,
  deleteTranslation,
} from "@/lib/adminApi";
import { listLanguages } from "@/lib/api";

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
  time: "Time & Seasons",
  money: "Money & Trade",
  clothing: "Clothing & Appearance",
  emotions: "Emotions & Feelings",
  colors: "Colors & Patterns",
  numbers: "Numbers & Counting",
  actions: "Actions & Verbs",
  phrase: "Phrases & Idioms",
  measurement: "Measurement & Size",
  other: "Other",
};

interface Props {
  concept: ConceptDetail;
  similarWords: ConceptListItem[];
  featuredLang?: LanguageWithCount | null;
  moreInLanguage?: TranslationWithConcept[];
  otherMeaningsMap?: Record<string, ConceptDetail[]>;
}

export default function WordDetail({ concept, similarWords, featuredLang, moreInLanguage = [], otherMeaningsMap = {} }: Props) {
  const { isAdmin, isLoading: authLoading, token, username, logout } = useAdminAuth();
  const router = useRouter();

  // ── Edit mode state ─────────────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [editingConcept, setEditingConcept] = useState(false);
  const [editingTranslationId, setEditingTranslationId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Local copies for optimistic UI updates
  const [localConcept, setLocalConcept] = useState(concept);
  const [localTranslations, setLocalTranslations] = useState<Translation[]>(concept.translations);
  const [allLanguages, setAllLanguages] = useState<LanguageWithCount[]>([]);

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // ── Contribution modal state ────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ContributionType>("new_translation");
  const [prefill, setPrefill] = useState<{
    conceptTerm?: string;
    conceptId?: string;
    langName?: string;
    word?: string;
  }>({});

  // Load languages when add-translation form opens
  useEffect(() => {
    if (showAddForm && allLanguages.length === 0) {
      listLanguages().then(setAllLanguages).catch(() => {});
    }
  }, [showAddForm, allLanguages.length]);

  // Featured translation logic (unchanged)
  const featuredTranslation = featuredLang
    ? localTranslations.find((t) => t.languages.some(l => l.code === featuredLang.code)) ?? null
    : null;
  const otherTranslations = featuredTranslation
    ? localTranslations.filter((t) => t.id !== featuredTranslation.id)
    : localTranslations;

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function flash(text: string, ok: boolean) {
    setSaveMsg({ text, ok });
    setTimeout(() => setSaveMsg(null), 3000);
  }

  async function handleSaveConcept(data: Partial<typeof localConcept>) {
    if (!token) return;
    setSaving(true);
    try {
      await patchConcept(localConcept.slug, data, token);
      setLocalConcept(prev => ({ ...prev, ...data }));
      setEditingConcept(false);
      flash("Concept saved", true);
    } catch (e) {
      flash((e as Error).message, false);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveTranslation(id: string, data: Parameters<typeof patchTranslation>[1]) {
    if (!token) return;
    setSaving(true);
    try {
      const updated = await patchTranslation(id, data, token);
      setLocalTranslations(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
      setEditingTranslationId(null);
      flash("Translation saved", true);
    } catch (e) {
      flash((e as Error).message, false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTranslation(id: string) {
    if (!token) return;
    if (!confirm("Delete this translation? This cannot be undone.")) return;
    setSaving(true);
    try {
      await deleteTranslation(id, token);
      setLocalTranslations(prev => prev.filter(t => t.id !== id));
      setEditingTranslationId(null);
      flash("Translation deleted", true);
    } catch (e) {
      flash((e as Error).message, false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConcept() {
    if (!token) return;
    if (!confirm(`Permanently delete "${localConcept.english_term}" and all its translations? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await deleteConcept(localConcept.slug, token);
      if (featuredLang) {
        router.push(`/browse/languages/${featuredLang.code}`);
      } else {
        router.push(`/browse/categories/${localConcept.category}`);
      }
    } catch (e) {
      flash((e as Error).message, false);
      setSaving(false);
    }
  }

  async function handleAddTranslation(data: Parameters<typeof createTranslation>[0]) {
    if (!token) return;
    setSaving(true);
    try {
      const created = await createTranslation(data, token);
      setLocalTranslations(prev => [...prev, created]);
      setShowAddForm(false);
      flash("Translation added", true);
    } catch (e) {
      flash((e as Error).message, false);
    } finally {
      setSaving(false);
    }
  }

  function openAddTranslation() {
    setModalType("new_translation");
    setPrefill({ conceptTerm: localConcept.english_term, conceptId: localConcept.id });
    setModalOpen(true);
  }

  function openCorrection(langName: string, word: string) {
    setModalType("correction");
    setPrefill({ conceptTerm: localConcept.english_term, conceptId: localConcept.id, langName, word });
    setModalOpen(true);
  }

  return (
    <>
      <Nav />

      {/* Admin toolbar */}
      {!authLoading && isAdmin && (
        <div className="sticky top-0 z-50 bg-ink text-cream text-[11px] flex items-center justify-between px-5 py-2 gap-4 font-[family-name:var(--font-jost)]">
          <div className="flex items-center gap-3">
            <span className="text-cream/60">Admin: {username}</span>
            <button
              onClick={() => { setEditMode(e => !e); setEditingTranslationId(null); setEditingConcept(false); setShowAddForm(false); }}
              className={`px-3 py-1 rounded text-[10px] font-medium tracking-[0.06em] uppercase border cursor-pointer transition-colors ${editMode ? "bg-ochre text-ink border-ochre" : "bg-transparent text-cream/80 border-cream/30 hover:border-cream/60"}`}
            >
              {editMode ? "✓ Edit mode ON" : "Edit mode"}
            </button>
            {saveMsg && (
              <span className={saveMsg.ok ? "text-green-400" : "text-red-400"}>
                {saveMsg.text}
              </span>
            )}
            {saving && <span className="text-cream/50">Saving…</span>}
          </div>
          <div className="flex items-center gap-3">
            {editMode && (
              <button
                onClick={handleDeleteConcept}
                disabled={saving}
                className="text-[10px] text-red-400 border border-red-500/40 rounded px-2.5 py-1 cursor-pointer hover:bg-red-500/10 transition-colors font-[family-name:var(--font-jost)] disabled:opacity-50"
              >
                Delete word
              </button>
            )}
            <button onClick={logout} className="text-cream/50 hover:text-cream/80 cursor-pointer transition-colors">
              Sign out
            </button>
          </div>
        </div>
      )}

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
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Header */}
        <div className="mb-8">
          {editMode && editingConcept ? (
            <ConceptEditForm
              concept={localConcept}
              onSave={handleSaveConcept}
              onCancel={() => setEditingConcept(false)}
              saving={saving}
            />
          ) : featuredTranslation ? (
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
                English: <strong className="font-medium">{localConcept.english_term}</strong>
                {localConcept.definition && (
                  <span className="text-ink3"> — {localConcept.definition}</span>
                )}
              </p>
              {featuredTranslation.cultural_note && (
                <p className="text-[13px] text-ink3 italic">{featuredTranslation.cultural_note}</p>
              )}
              {featuredTranslation.ethnic_groups.length > 0 && (
                <p className="text-[12px] text-ink3/70 mt-1">
                  {featuredTranslation.ethnic_groups.map(eg => `${eg.name} · ${eg.country_iso2}`).join(", ")}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <Link
                  href={`/browse/categories/${localConcept.category}`}
                  className="text-[11px] bg-ochre/[0.1] text-ochre-d px-2.5 py-0.5 rounded-[3px] tracking-[0.07em] uppercase font-medium no-underline hover:bg-ochre/[0.2] transition-colors"
                >
                  {localConcept.category}
                </Link>
                <span className="text-[13px] text-ink3">
                  {localTranslations.length} translation{localTranslations.length !== 1 ? "s" : ""} across African languages
                </span>
                {localConcept.verified && (
                  <span className="text-[11px] text-forest font-medium">✓ Verified</span>
                )}
                {editMode && (
                  <button onClick={() => setEditingConcept(true)} className="text-[10px] text-ink3 border border-border2 rounded px-2 py-0.5 cursor-pointer hover:text-ochre-d hover:border-ochre transition-colors font-[family-name:var(--font-jost)]">✎ Edit concept</button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-3 mb-2">
                <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-bold text-ink leading-tight">
                  {localConcept.english_term}
                </h1>
                <Link
                  href={`/browse/categories/${localConcept.category}`}
                  className="text-[11px] bg-ochre/[0.1] text-ochre-d px-2.5 py-0.5 rounded-[3px] tracking-[0.07em] uppercase font-medium no-underline hover:bg-ochre/[0.2] transition-colors"
                >
                  {localConcept.category}
                </Link>
                {editMode && (
                  <button onClick={() => setEditingConcept(true)} className="text-[10px] text-ink3 border border-border2 rounded px-2 py-0.5 cursor-pointer hover:text-ochre-d hover:border-ochre transition-colors font-[family-name:var(--font-jost)]">✎ Edit</button>
                )}
              </div>
              {localConcept.definition && (
                <p className="text-[14px] text-ink2 mb-1">{localConcept.definition}</p>
              )}
              <p className="text-[14px] text-ink3">
                {localTranslations.length} translation{localTranslations.length !== 1 ? "s" : ""} across African languages
                {localConcept.verified && (
                  <span className="ml-2 text-[11px] text-forest font-medium">✓ Verified</span>
                )}
              </p>
            </>
          )}
        </div>

        {/* Pre-colonial context */}
        {localConcept.precolonial_context && (
          <div className="bg-ochre/[0.06] border-l-[3px] border-ochre rounded-r-lg px-5 py-4 mb-10">
            <div className="text-[10px] font-medium text-ochre-d tracking-[0.1em] uppercase mb-1.5">
              Pre-colonial context
            </div>
            <p className="text-[14px] text-ink2 leading-relaxed italic">
              &ldquo;{localConcept.precolonial_context}&rdquo;
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
                onClick={editMode ? () => setShowAddForm(true) : openAddTranslation}
                className="text-[12px] font-medium text-ochre-d border border-border2 px-5 py-2.5 rounded cursor-pointer font-[family-name:var(--font-jost)] hover:bg-ochre/[0.07] transition-all"
              >
                + Add translation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 bg-cream border border-border rounded-lg overflow-hidden">
              {otherTranslations.map((t) => (
                editMode && editingTranslationId === t.id ? (
                  <div key={t.id} className="px-5 py-4 border-r border-b border-border bg-cream col-span-full sm:col-span-1 lg:col-span-1">
                    <TranslationEditForm
                      translation={t}
                      onSave={(data) => handleSaveTranslation(t.id, data)}
                      onDelete={() => handleDeleteTranslation(t.id)}
                      onCancel={() => setEditingTranslationId(null)}
                      saving={saving}
                    />
                  </div>
                ) : (
                  <div
                    key={t.id}
                    className="relative group px-5 py-4 border-r border-b border-border last:border-b-0"
                  >
                    {/* Non-edit-mode: wrap in Link; edit-mode: plain div */}
                    {editMode ? (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase">
                          {t.languages.map(l => l.name).join(", ")}
                        </span>
                        {t.is_precolonial && (
                          <span className="text-[9px] bg-forest/[0.08] text-forest px-1.5 py-px rounded tracking-[0.05em]">pre-colonial</span>
                        )}
                        <div className="ml-auto flex gap-1.5">
                          <button
                            onClick={() => setEditingTranslationId(t.id)}
                            className="text-[9px] text-ink3 border border-border2 rounded px-1.5 py-px cursor-pointer hover:text-ochre-d font-[family-name:var(--font-jost)]"
                          >✎ Edit</button>
                          <button
                            onClick={() => handleDeleteTranslation(t.id)}
                            className="text-[9px] text-red-500 border border-red-200 rounded px-1.5 py-px cursor-pointer hover:bg-red-50 font-[family-name:var(--font-jost)]"
                          >✕</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase">
                          {t.languages.map(l => l.name).join(", ")}
                        </span>
                        {t.is_precolonial && (
                          <span className="text-[9px] bg-forest/[0.08] text-forest px-1.5 py-px rounded tracking-[0.05em]">pre-colonial</span>
                        )}
                      </div>
                    )}
                    <Link
                      href={`/words/${localConcept.slug}?lang=${t.languages[0]?.code ?? ""}`}
                      className="block no-underline hover:text-ochre-d"
                    >
                      <div className="font-[family-name:var(--font-cormorant)] text-[26px] font-semibold text-ink hover:text-ochre-d transition-colors leading-tight">
                        {t.word}
                      </div>
                    </Link>
                    {t.phonetic && (
                      <div className="text-[12px] text-ink3 mt-1 font-[family-name:var(--font-dm-mono)]">/{t.phonetic}/</div>
                    )}
                    {t.cultural_note && (
                      <div className="text-[11px] text-ink3 mt-2 leading-relaxed italic">{t.cultural_note}</div>
                    )}
                    {t.ethnic_groups.length > 0 && (
                      <div className="text-[10px] text-ink3/70 mt-1.5">
                        {t.ethnic_groups.map(eg => `${eg.name} · ${eg.country_iso2}`).join(", ")}
                      </div>
                    )}
                    {!editMode && (
                      <button
                        onClick={() => openCorrection(t.languages.map(l => l.name).join(", "), t.word)}
                        className="absolute top-3 right-3 text-[10px] text-ink3 bg-bg2 border border-border rounded-[3px] px-[7px] py-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-[family-name:var(--font-jost)] hover:text-ochre-d hover:border-border2"
                      >Correct</button>
                    )}
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Admin: add translation form */}
        {editMode && (
          <div className="mb-6">
            {showAddForm ? (
              <AddTranslationForm
                conceptSlug={localConcept.slug}
                languages={allLanguages}
                onAdd={handleAddTranslation}
                onCancel={() => setShowAddForm(false)}
                saving={saving}
              />
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="text-[12px] font-medium text-ochre-d border border-dashed border-ochre/50 px-5 py-3 rounded w-full cursor-pointer hover:bg-ochre/[0.04] transition-all font-[family-name:var(--font-jost)]"
              >
                + Add translation (admin)
              </button>
            )}
          </div>
        )}

        {/* Add translation CTA — hidden in admin edit mode */}
        {!editMode && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-ochre/[0.04] border border-border rounded-lg px-5 py-4">
          <span className="text-[13px] text-ink3">
            Know <strong className="text-ink2 font-medium">{localConcept.english_term}</strong> in another language or meaning?
          </span>
          <div className="flex gap-2.5">
            <button
              onClick={openAddTranslation}
              className="text-[12px] font-medium text-cream bg-ink border-none px-5 py-2.5 rounded cursor-pointer font-[family-name:var(--font-jost)] tracking-[0.05em] uppercase hover:bg-ochre-d transition-colors"
            >
              + Add translation
            </button>
            <button
              onClick={() => {
                setModalType("new_concept");
                setPrefill({});
                setModalOpen(true);
              }}
              className="text-[12px] font-medium text-ink bg-transparent border border-border px-5 py-2.5 rounded cursor-pointer font-[family-name:var(--font-jost)] tracking-[0.05em] uppercase hover:border-ochre hover:text-ochre-d transition-colors"
            >
              + Other meaning
            </button>
          </div>
        </div>
        )}

        {/* Other meanings — when the same word means something else */}
        {Object.keys(otherMeaningsMap).length > 0 && (
          <div className="mt-10">
            <h2 className="font-[family-name:var(--font-cormorant)] text-[28px] font-bold text-ink mb-6">
              Other meanings
            </h2>
            {Object.entries(otherMeaningsMap).map(([wordLabel, concepts]) => (
              <div key={wordLabel} className="mb-6">
                <h3 className="text-[11px] font-medium text-ink3 tracking-[0.1em] uppercase mb-3">
                  &ldquo;{wordLabel}&rdquo; also means
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 bg-cream border border-border rounded-lg overflow-hidden">
                  {concepts.map((c) => (
                    <Link
                      key={c.id}
                      href={`/words/${c.slug}`}
                      className="block px-5 py-4 border-r border-b border-border hover:bg-ochre/[0.03] transition-colors group no-underline"
                    >
                      <div className="font-[family-name:var(--font-cormorant)] text-[24px] font-semibold text-ink group-hover:text-ochre-d transition-colors leading-tight">
                        {c.english_term}
                      </div>
                      {c.definition && (
                        <div className="text-[11px] text-ink3 mt-0.5 italic">{c.definition}</div>
                      )}
                      <div className="text-[10px] text-ink3/70 mt-1.5">
                        {CATEGORY_LABELS[c.category] ?? c.category}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* More in [Language] — only when coming from a language page */}
        {featuredLang && moreInLanguage.length > 0 && (
          <div className="mt-10">
            <h2 className="text-[11px] font-medium text-ink3 tracking-[0.1em] uppercase mb-4">
              More {CATEGORY_LABELS[localConcept.category] ?? localConcept.category} in{" "}
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
                href={`/browse/categories/${localConcept.category}`}
                className="text-ochre-d no-underline hover:text-ochre transition-colors"
              >
                {localConcept.category}
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

// ── Inline edit forms ─────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  "animals", "food", "nature", "family", "culture", "body", "spiritual",
  "tools", "geography", "time", "money", "clothing", "emotions",
  "colors", "numbers", "actions", "phrase", "measurement", "other",
];

const fieldCls = "w-full bg-bg border border-border rounded px-2.5 py-1.5 text-[13px] text-ink outline-none focus:border-ochre font-[family-name:var(--font-jost)] resize-none";
const labelCls = "text-[10px] font-medium text-ink3 tracking-[0.06em] uppercase mb-0.5 block";

function ConceptEditForm({
  concept, onSave, onCancel, saving,
}: {
  concept: ConceptDetail;
  onSave: (data: Partial<ConceptDetail>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    english_term: concept.english_term,
    definition: concept.definition ?? "",
    category: concept.category,
    precolonial_context: concept.precolonial_context ?? "",
    verified: concept.verified,
  });

  return (
    <div className="bg-cream border border-ochre/30 rounded-lg px-5 py-5">
      <div className="text-[10px] font-medium text-ochre-d tracking-[0.1em] uppercase mb-4">Edit concept</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>English term</label>
          <input className={fieldCls} value={form.english_term} onChange={e => setForm(f => ({ ...f, english_term: e.target.value }))} />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select className={fieldCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Definition (short)</label>
          <input className={fieldCls} value={form.definition} onChange={e => setForm(f => ({ ...f, definition: e.target.value }))} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Pre-colonial context</label>
          <textarea className={fieldCls} rows={3} value={form.precolonial_context} onChange={e => setForm(f => ({ ...f, precolonial_context: e.target.value }))} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="c-verified" checked={form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} />
          <label htmlFor="c-verified" className="text-[12px] text-ink3 cursor-pointer">Verified</label>
        </div>
      </div>
      <div className="flex items-center gap-2.5 mt-4">
        <button disabled={saving} onClick={() => onSave(form)} className="text-[11px] font-medium bg-ink text-cream px-4 py-2 rounded cursor-pointer hover:bg-ochre-d transition-colors disabled:opacity-50 font-[family-name:var(--font-jost)]">Save</button>
        <button onClick={onCancel} className="text-[11px] text-ink3 px-4 py-2 rounded cursor-pointer hover:text-ink transition-colors font-[family-name:var(--font-jost)]">Cancel</button>
      </div>
    </div>
  );
}

function TranslationEditForm({
  translation, onSave, onDelete, onCancel, saving,
}: {
  translation: Translation;
  onSave: (data: Parameters<typeof patchTranslation>[1]) => void;
  onDelete: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    word: translation.word,
    phonetic: translation.phonetic ?? "",
    cultural_note: translation.cultural_note ?? "",
    source: translation.source ?? "",
    is_precolonial: translation.is_precolonial,
    verified: translation.verified,
  });

  return (
    <div>
      <div className="text-[10px] font-medium text-ochre-d tracking-[0.1em] uppercase mb-3">
        {translation.languages.map(l => l.name).join(", ")}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className={labelCls}>Word</label>
          <input className={fieldCls} value={form.word} onChange={e => setForm(f => ({ ...f, word: e.target.value }))} />
        </div>
        <div>
          <label className={labelCls}>Phonetic</label>
          <input className={fieldCls} value={form.phonetic} placeholder="/pho·ne·tic/" onChange={e => setForm(f => ({ ...f, phonetic: e.target.value }))} />
        </div>
        <div>
          <label className={labelCls}>Source</label>
          <input className={fieldCls} value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Cultural note</label>
          <textarea className={fieldCls} rows={2} value={form.cultural_note} onChange={e => setForm(f => ({ ...f, cultural_note: e.target.value }))} />
        </div>
        <div className="flex items-center gap-3 col-span-2">
          <label className="flex items-center gap-1.5 text-[11px] text-ink3 cursor-pointer">
            <input type="checkbox" checked={form.is_precolonial} onChange={e => setForm(f => ({ ...f, is_precolonial: e.target.checked }))} />
            Pre-colonial
          </label>
          <label className="flex items-center gap-1.5 text-[11px] text-ink3 cursor-pointer">
            <input type="checkbox" checked={form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} />
            Verified
          </label>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button disabled={saving} onClick={() => onSave(form)} className="text-[11px] font-medium bg-ink text-cream px-3 py-1.5 rounded cursor-pointer hover:bg-ochre-d transition-colors disabled:opacity-50 font-[family-name:var(--font-jost)]">Save</button>
        <button onClick={onCancel} className="text-[11px] text-ink3 px-3 py-1.5 rounded cursor-pointer hover:text-ink transition-colors font-[family-name:var(--font-jost)]">Cancel</button>
        <button disabled={saving} onClick={onDelete} className="text-[11px] text-red-500 px-3 py-1.5 rounded cursor-pointer hover:bg-red-50 transition-colors ml-auto font-[family-name:var(--font-jost)]">Delete</button>
      </div>
    </div>
  );
}

function AddTranslationForm({
  conceptSlug, languages, onAdd, onCancel, saving,
}: {
  conceptSlug: string;
  languages: LanguageWithCount[];
  onAdd: (data: Parameters<typeof createTranslation>[0]) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    word: "",
    phonetic: "",
    cultural_note: "",
    source: "",
    is_precolonial: false,
    verified: true,
    language_code: "",
  });

  return (
    <div className="bg-ochre/[0.04] border border-dashed border-ochre/40 rounded-lg px-5 py-5">
      <div className="text-[10px] font-medium text-ochre-d tracking-[0.1em] uppercase mb-4">Add translation</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Language</label>
          <select className={fieldCls} value={form.language_code} onChange={e => setForm(f => ({ ...f, language_code: e.target.value }))}>
            <option value="">— select —</option>
            {languages.map(l => <option key={l.code} value={l.code}>{l.name} ({l.code})</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Word</label>
          <input className={fieldCls} value={form.word} onChange={e => setForm(f => ({ ...f, word: e.target.value }))} />
        </div>
        <div>
          <label className={labelCls}>Phonetic</label>
          <input className={fieldCls} value={form.phonetic} onChange={e => setForm(f => ({ ...f, phonetic: e.target.value }))} />
        </div>
        <div>
          <label className={labelCls}>Source</label>
          <input className={fieldCls} value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Cultural note</label>
          <textarea className={fieldCls} rows={2} value={form.cultural_note} onChange={e => setForm(f => ({ ...f, cultural_note: e.target.value }))} />
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-[11px] text-ink3 cursor-pointer">
            <input type="checkbox" checked={form.is_precolonial} onChange={e => setForm(f => ({ ...f, is_precolonial: e.target.checked }))} />
            Pre-colonial
          </label>
          <label className="flex items-center gap-1.5 text-[11px] text-ink3 cursor-pointer">
            <input type="checkbox" checked={form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} />
            Verified
          </label>
        </div>
      </div>
      <div className="flex items-center gap-2.5 mt-4">
        <button
          disabled={saving || !form.word.trim() || !form.language_code}
          onClick={() => onAdd({ concept_slug: conceptSlug, language_codes: [form.language_code], word: form.word, phonetic: form.phonetic || undefined, cultural_note: form.cultural_note || undefined, source: form.source || undefined, is_precolonial: form.is_precolonial, verified: form.verified })}
          className="text-[11px] font-medium bg-ink text-cream px-4 py-2 rounded cursor-pointer hover:bg-ochre-d transition-colors disabled:opacity-50 font-[family-name:var(--font-jost)]"
        >Add</button>
        <button onClick={onCancel} className="text-[11px] text-ink3 px-4 py-2 rounded cursor-pointer hover:text-ink transition-colors font-[family-name:var(--font-jost)]">Cancel</button>
      </div>
    </div>
  );
}

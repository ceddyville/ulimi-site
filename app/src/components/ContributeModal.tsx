"use client";

import { useState, useEffect, useCallback } from "react";
import type { ContributionType, ContributionPayload } from "@/lib/types";
import { submitContribution } from "@/lib/api";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  initialType: ContributionType;
  prefill?: {
    conceptTerm?: string;
    conceptId?: string;
    langName?: string;
    word?: string;
    translationId?: string;
  };
}

const LANGUAGES = [
  { code: "af", name: "Afrikaans", regions: ["South Africa", "Namibia"] },
  { code: "am", name: "Amharic", regions: ["Ethiopia"] },
  { code: "bxk", name: "Luhya", regions: ["Kenya"] },
  { code: "ebu", name: "Embu (Kiembu)", regions: ["Kenya"] },
  { code: "guz", name: "Kisii (Gusii)", regions: ["Kenya"] },
  { code: "ha", name: "Hausa", regions: ["Nigeria", "Niger", "Ghana", "Chad"] },
  { code: "hz", name: "Herero", regions: ["Namibia", "Botswana"] },
  { code: "ki", name: "Kikuyu (Gikuyu)", regions: ["Kenya"] },
  { code: "luo", name: "Luo", regions: ["Kenya", "Uganda", "Tanzania"] },
  { code: "mas", name: "Maasai (Maa)", regions: ["Kenya", "Tanzania"] },
  { code: "nd", name: "Ndebele", regions: ["Zimbabwe", "South Africa"] },
  { code: "nyf", name: "Mijikenda", regions: ["Kenya"] },
  { code: "sn", name: "Shona", regions: ["Zimbabwe"] },
  { code: "so", name: "Somali", regions: ["Somalia", "Ethiopia", "Kenya", "Djibouti"] },
  { code: "ss", name: "Siswati", regions: ["Eswatini", "South Africa"] },
  { code: "st", name: "Sotho", regions: ["South Africa", "Lesotho"] },
  { code: "sw", name: "Swahili", regions: ["Kenya", "Tanzania", "Uganda", "DRC"] },
  { code: "tn", name: "Tswana (Setswana)", regions: ["Botswana", "South Africa"] },
  { code: "ts", name: "Shangaan (Tsonga)", regions: ["South Africa", "Mozambique"] },
  { code: "tw", name: "Twi (Akan)", regions: ["Ghana", "Ivory Coast"] },
  { code: "ve", name: "Venda", regions: ["South Africa", "Zimbabwe"] },
  { code: "xh", name: "Xhosa", regions: ["South Africa"] },
  { code: "yo", name: "Yoruba", regions: ["Nigeria", "Benin", "Togo"] },
  { code: "zu", name: "Zulu", regions: ["South Africa"] },
  { code: "other", name: "Other", regions: [] },
];

const COUNTRIES = Array.from(
  new Set(LANGUAGES.flatMap((l) => l.regions))
).sort();

const CATEGORIES = [
  { value: "animals", label: "Animals" },
  { value: "food", label: "Food & Plants" },
  { value: "nature", label: "Nature" },
  { value: "family", label: "Family & Social" },
  { value: "culture", label: "Culture & Governance" },
  { value: "body", label: "Body & Health" },
  { value: "spiritual", label: "Spiritual & Ceremonial" },
  { value: "tools", label: "Tools & Technology" },
  { value: "geography", label: "Geography & Place" },
];

const SUCCESS_MESSAGES: Record<ContributionType, string> = {
  new_concept:
    "Your new word has been submitted. It\u2019s now pending admin review \u2014 community members can upvote it while it waits.",
  new_translation:
    "Your translation has been submitted and will go live after admin approval.",
  correction:
    "Your correction has been submitted. The admin will review the before/after diff before applying it.",
};

export default function ContributeModal({ open, onClose, initialType, prefill }: ModalProps) {
  const [activeTab, setActiveTab] = useState<ContributionType>(initialType);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [trustError, setTrustError] = useState(false);

  // Form fields — new_concept
  const [english, setEnglish] = useState("");
  const [category, setCategory] = useState("");
  const [precolonial, setPrecolonial] = useState("");
  const [word, setWord] = useState("");
  const [country, setCountry] = useState("");
  const [lang, setLang] = useState("");
  const [langOther, setLangOther] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [ethnic, setEthnic] = useState("");
  const [culturalNote, setCulturalNote] = useState("");
  const [isPrecolonialFlag, setIsPrecolonialFlag] = useState(true);

  // Form fields — new_translation
  const [conceptRef, setConceptRef] = useState("");
  const [word2, setWord2] = useState("");
  const [country2, setCountry2] = useState("");
  const [lang2, setLang2] = useState("");
  const [langOther2, setLangOther2] = useState("");
  const [phonetic2, setPhonetic2] = useState("");
  const [ethnic2, setEthnic2] = useState("");
  const [culturalNote2, setCulturalNote2] = useState("");
  const [isPrecolonial2, setIsPrecolonial2] = useState(true);

  // Filtered languages based on selected country
  const filteredLangs = country
    ? LANGUAGES.filter((l) => l.regions.includes(country) || l.code === "other")
    : LANGUAGES;
  const filteredLangs2 = country2
    ? LANGUAGES.filter((l) => l.regions.includes(country2) || l.code === "other")
    : LANGUAGES;

  // Form fields — correction
  const [correctionField, setCorrectionField] = useState("word");
  const [oldVal, setOldVal] = useState("");
  const [newVal, setNewVal] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");

  // Shared
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trust, setTrust] = useState("");

  // Reset on open
  useEffect(() => {
    if (open) {
      setActiveTab(initialType);
      setSuccess(false);
      setError("");
      setTrustError(false);

      if (prefill?.conceptTerm && initialType === "new_concept") {
        setEnglish(prefill.conceptTerm);
      }
      if (prefill?.conceptTerm && initialType === "new_translation") {
        setConceptRef(prefill.conceptTerm);
      }
      if (prefill?.word && initialType === "correction") {
        setOldVal(prefill.word);
      }
    }
  }, [open, initialType, prefill]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!open) return null;

  const contextMessage = (() => {
    if (activeTab === "new_concept") {
      return prefill?.conceptTerm
        ? `You\u2019re adding \u201c${prefill.conceptTerm}\u201d as a new word. Fill in the details and your first translation.`
        : "Add a new word to the dictionary with your first translation.";
    }
    if (activeTab === "new_translation") {
      return `Adding a new language translation for \u201c${prefill?.conceptTerm || conceptRef}\u201d.`;
    }
    return `Correcting the ${prefill?.langName || ""} word \u201c${prefill?.word || oldVal}\u201d for \u201c${prefill?.conceptTerm || ""}\u201d.`;
  })();

  const handleSubmit = async () => {
    if (!trust.trim()) {
      setTrustError(true);
      return;
    }
    setTrustError(false);
    setError("");
    setSubmitting(true);

    try {
      let payload: ContributionPayload;

      if (activeTab === "new_concept") {
        payload = {
          contribution_type: "new_concept",
          proposed_data: {
            english_term: english,
            category,
            precolonial_context: precolonial,
            word,
            language_code: lang,
            language_name: lang === "other" ? langOther : undefined,
            phonetic,
            ethnic_group_name: ethnic,
            cultural_note: culturalNote,
            is_precolonial: isPrecolonialFlag,
          },
          contributor_name: name,
          contributor_email: email,
          contributor_note: trust,
        };
      } else if (activeTab === "new_translation") {
        payload = {
          contribution_type: "new_translation",
          concept: prefill?.conceptId || null,
          proposed_data: {
            word: word2,
            language_code: lang2,
            language_name: lang2 === "other" ? langOther2 : undefined,
            phonetic: phonetic2,
            ethnic_group_name: ethnic2,
            cultural_note: culturalNote2,
            is_precolonial: isPrecolonial2,
          },
          contributor_name: name,
          contributor_email: email,
          contributor_note: trust,
        };
      } else {
        payload = {
          contribution_type: "correction",
          existing_translation: prefill?.translationId || null,
          proposed_data: {
            [correctionField]: { old: oldVal, new: newVal },
          },
          contributor_name: name,
          contributor_email: email,
          contributor_note: trust,
        };
      }

      await submitContribution(payload);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? "Submission failed. Please check your fields and try again."
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-ink/55 flex items-center justify-center z-[1000] p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="bg-cream rounded-[14px] w-full max-w-[560px] border border-border overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-ink px-6 py-[18px] flex items-center justify-between sticky top-0 z-10">
          <span className="font-[family-name:var(--font-cormorant)] text-[21px] font-semibold text-cream">
            {activeTab === "new_concept"
              ? "Add a new word"
              : activeTab === "new_translation"
              ? "Add a translation"
              : "Suggest a correction"}
          </span>
          <button
            onClick={handleClose}
            className="bg-transparent border-none text-cream/50 text-[22px] cursor-pointer leading-none px-0.5 hover:text-cream transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {success ? (
          /* Success state */
          <div className="px-6 py-9 text-center">
            <div className="w-[50px] h-[50px] rounded-full bg-forest/10 border border-forest/30 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M5 11l4 4 8-8" stroke="#2D6B43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="font-[family-name:var(--font-cormorant)] text-[26px] font-bold text-ink mb-2.5">
              Asante sana
            </div>
            <p className="text-[13px] text-ink3 leading-[1.65] max-w-[360px] mx-auto mb-6">
              {SUCCESS_MESSAGES[activeTab]}
            </p>
            <button
              onClick={handleClose}
              className="bg-ink text-cream border-none rounded px-7 py-[11px] text-[12px] font-medium cursor-pointer font-[family-name:var(--font-jost)] tracking-[0.06em] uppercase"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Form body */}
            <div className="px-6 py-[22px]">
              {/* Context banner */}
              <div className="bg-ochre/[0.07] border border-border2 rounded-md px-3.5 py-2.5 mb-5 text-[12px] text-ochre-d leading-[1.55]">
                {contextMessage}
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border mb-5">
                {(["new_concept", "new_translation", "correction"] as ContributionType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-2.5 px-2 text-center cursor-pointer text-[12px] border-b-2 transition-all bg-transparent border-t-0 border-l-0 border-r-0 font-[family-name:var(--font-jost)] ${
                      activeTab === t
                        ? "text-ochre-d border-b-ochre"
                        : "text-ink3 border-b-transparent"
                    }`}
                  >
                    {t === "new_concept" ? "New word" : t === "new_translation" ? "Add translation" : "Correction"}
                  </button>
                ))}
              </div>

              {/* NEW CONCEPT PANEL */}
              {activeTab === "new_concept" && (
                <div>
                  <div className="grid grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">
                        English term <span className="text-ochre">*</span>
                      </label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="e.g. Baobab tree" value={english} onChange={(e) => setEnglish(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">
                        Category <span className="text-ochre">*</span>
                      </label>
                      <select className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none cursor-pointer appearance-none transition-colors focus:border-ochre" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">— select —</option>
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Pre-colonial context</label>
                    <textarea className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none resize-y min-h-[68px] leading-[1.55] transition-colors focus:border-ochre placeholder:text-ink3" placeholder="What was this thing called or used for before colonial naming? Optional but valuable." rows={2} value={precolonial} onChange={(e) => setPrecolonial(e.target.value)} />
                    <div className="text-[11px] text-ink3 mt-1 leading-[1.5] italic">
                      This is what makes Ulimi different — the story behind the word.
                    </div>
                  </div>
                  <div className="h-px bg-border my-[18px]" />
                  <div className="text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-3">Your translation for this word</div>
                  <div className="grid grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Word <span className="text-ochre">*</span></label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="e.g. Uyombo" value={word} onChange={(e) => setWord(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Country</label>
                      <select className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none cursor-pointer appearance-none transition-colors focus:border-ochre" value={country} onChange={(e) => { setCountry(e.target.value); setLang(""); }}>
                        <option value="">— all countries —</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Language <span className="text-ochre">*</span></label>
                      <select className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none cursor-pointer appearance-none transition-colors focus:border-ochre" value={lang} onChange={(e) => setLang(e.target.value)}>
                        <option value="">— select —</option>
                        {filteredLangs.map((l) => (
                          <option key={l.code} value={l.code}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {lang === "other" && (
                    <div className="mb-3.5">
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Language name <span className="text-ochre">*</span></label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="e.g. Tigrinya, Wolof, Lingala…" value={langOther} onChange={(e) => setLangOther(e.target.value)} />
                      <div className="text-[11px] text-ink3 mt-1 leading-[1.5] italic">Type the full name of the language. The admin will add it to the system.</div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Phonetic</label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="e.g. oo-YOM-boh" value={phonetic} onChange={(e) => setPhonetic(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Ethnic group</label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="e.g. Luo, Kikuyu…" value={ethnic} onChange={(e) => setEthnic(e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Cultural note</label>
                    <textarea className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none resize-y min-h-[68px] leading-[1.55] transition-colors focus:border-ochre placeholder:text-ink3" placeholder="Cultural significance, ceremonies, proverbs, how the word was used…" rows={2} value={culturalNote} onChange={(e) => setCulturalNote(e.target.value)} />
                  </div>
                  <label className="flex items-center gap-2.5 mb-3.5 cursor-pointer">
                    <input type="checkbox" className="w-[15px] h-[15px] accent-ochre cursor-pointer shrink-0" checked={isPrecolonialFlag} onChange={(e) => setIsPrecolonialFlag(e.target.checked)} />
                    <span className="text-[13px] text-ink2 leading-[1.4]">This is an <em className="text-ochre-d not-italic">indigenous pre-colonial term</em> — it predates colonisation</span>
                  </label>
                </div>
              )}

              {/* NEW TRANSLATION PANEL */}
              {activeTab === "new_translation" && (
                <div>
                  <div className="mb-3.5">
                    <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Word (English)</label>
                    <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="Which word are you translating?" value={conceptRef} onChange={(e) => setConceptRef(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Word <span className="text-ochre">*</span></label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="The word in your language" value={word2} onChange={(e) => setWord2(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Country</label>
                      <select className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none cursor-pointer appearance-none transition-colors focus:border-ochre" value={country2} onChange={(e) => { setCountry2(e.target.value); setLang2(""); }}>
                        <option value="">— all countries —</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Language <span className="text-ochre">*</span></label>
                      <select className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none cursor-pointer appearance-none transition-colors focus:border-ochre" value={lang2} onChange={(e) => setLang2(e.target.value)}>
                        <option value="">— select —</option>
                        {filteredLangs2.map((l) => (
                          <option key={l.code} value={l.code}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {lang2 === "other" && (
                    <div className="mb-3.5">
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Language name <span className="text-ochre">*</span></label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="e.g. Tigrinya, Wolof, Lingala…" value={langOther2} onChange={(e) => setLangOther2(e.target.value)} />
                      <div className="text-[11px] text-ink3 mt-1 leading-[1.5] italic">Type the full name of the language. The admin will add it to the system.</div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Phonetic</label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="e.g. SEE-bwor" value={phonetic2} onChange={(e) => setPhonetic2(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Ethnic group</label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="e.g. Luo" value={ethnic2} onChange={(e) => setEthnic2(e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Cultural note</label>
                    <textarea className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none resize-y min-h-[68px] leading-[1.55] transition-colors focus:border-ochre placeholder:text-ink3" placeholder="How is this word used? Any significance, variations, proverbs?" rows={2} value={culturalNote2} onChange={(e) => setCulturalNote2(e.target.value)} />
                  </div>
                  <label className="flex items-center gap-2.5 mb-3.5 cursor-pointer">
                    <input type="checkbox" className="w-[15px] h-[15px] accent-ochre cursor-pointer shrink-0" checked={isPrecolonial2} onChange={(e) => setIsPrecolonial2(e.target.checked)} />
                    <span className="text-[13px] text-ink2 leading-[1.4]">This is an <em className="text-ochre-d not-italic">indigenous pre-colonial term</em></span>
                  </label>
                </div>
              )}

              {/* CORRECTION PANEL */}
              {activeTab === "correction" && (
                <div>
                  <div className="mb-3.5">
                    <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">What needs correcting?</label>
                    <select className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none cursor-pointer appearance-none transition-colors focus:border-ochre" value={correctionField} onChange={(e) => setCorrectionField(e.target.value)}>
                      <option value="word">The word itself is incorrect</option>
                      <option value="phonetic">The phonetic / pronunciation is wrong</option>
                      <option value="cultural_note">The cultural note is inaccurate</option>
                      <option value="language">It&apos;s attributed to the wrong language</option>
                      <option value="is_precolonial">Pre-colonial flag is incorrect</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Current value</label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="What it currently says" value={oldVal} onChange={(e) => setOldVal(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Correct value <span className="text-ochre">*</span></label>
                      <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="What it should say" value={newVal} onChange={(e) => setNewVal(e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Source / reason</label>
                    <textarea className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none resize-y min-h-[68px] leading-[1.55] transition-colors focus:border-ochre placeholder:text-ink3" placeholder="Why is this wrong? Cite a source, your expertise, or oral tradition." rows={2} value={correctionReason} onChange={(e) => setCorrectionReason(e.target.value)} />
                  </div>
                </div>
              )}

              {/* About you — shared fields */}
              <div className="h-px bg-border my-[18px]" />
              <div className="text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-3">About you</div>
              <div className="grid grid-cols-2 gap-3 mb-3.5">
                <div>
                  <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Your name</label>
                  <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" placeholder="How you'd like to be credited" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">Email</label>
                  <input className="w-full bg-bg border border-border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3" type="email" placeholder="Optional — for admin follow-up" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="mb-3.5">
                <label className="block text-[10px] font-medium text-ink3 tracking-[0.08em] uppercase mb-[5px]">
                  Why should we trust this? <span className="text-ochre">*</span>
                </label>
                <textarea
                  className={`w-full bg-bg border rounded px-[13px] py-2.5 text-ink text-[14px] font-[family-name:var(--font-jost)] outline-none resize-y min-h-[68px] leading-[1.55] transition-colors focus:border-ochre placeholder:text-ink3 ${trustError ? "border-ochre" : "border-border"}`}
                  placeholder="e.g. Native Luo speaker from Kisumu, my grandmother used this word. Or: academic source, oral tradition, linguist at University of Nairobi…"
                  rows={2}
                  value={trust}
                  onChange={(e) => {
                    setTrust(e.target.value);
                    if (e.target.value.trim()) setTrustError(false);
                  }}
                />
                <div className="text-[11px] text-ink3 mt-1 leading-[1.5] italic">
                  <strong className="text-ochre-d not-italic">This is the most important field.</strong> The admin reads this first when deciding whether to approve.
                </div>
              </div>
            </div>

            {/* Footer */}
            {error && (
              <div className="mx-6 mb-0 mt-[-8px] bg-red-50 border border-red-200 rounded-md px-3.5 py-2.5 text-[12px] text-red-700 leading-[1.55]">
                {error}
              </div>
            )}
            <div className="px-6 py-3.5 border-t border-border flex items-center justify-between gap-3 bg-bg2 sticky bottom-0">
              <div className="text-[11px] text-ink3 leading-[1.5] max-w-[280px]">
                All contributions are <strong className="text-ink2 font-medium">reviewed by an admin</strong> before going live. You will be credited when your word is approved.
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-ink text-cream border-none rounded px-7 py-[11px] text-[12px] font-medium cursor-pointer font-[family-name:var(--font-jost)] tracking-[0.07em] uppercase transition-colors hover:bg-ochre-d whitespace-nowrap disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

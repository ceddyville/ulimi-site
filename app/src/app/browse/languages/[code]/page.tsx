import Link from "next/link";
import type { Metadata } from "next";
import { getLanguage, getLanguageTranslations, listLanguages } from "@/lib/api";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  try {
    const lang = await getLanguage(code);
    return {
      title: `${lang.name} — Ulimi`,
      description: `Browse ${lang.translation_count} ${lang.name} words in the Ulimi dictionary.`,
    };
  } catch {
    return { title: "Language not found — Ulimi" };
  }
}

export async function generateStaticParams() {
  try {
    const languages = await listLanguages();
    return languages.map((l) => ({ code: l.code }));
  } catch {
    return [];
  }
}

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

export default async function LanguageDetailPage({ params }: Props) {
  const { code } = await params;

  let lang, translations;
  try {
    [lang, translations] = await Promise.all([
      getLanguage(code),
      getLanguageTranslations(code),
    ]);
  } catch {
    return (
      <div className="py-20 text-center">
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-bold text-ink mb-3">
          Language not found
        </h1>
        <p className="text-ink3 text-sm mb-6">
          No language with code &ldquo;{code}&rdquo; exists in the dictionary.
        </p>
        <Link href="/browse/languages" className="text-sm font-medium text-ochre-d border border-border2 px-5 py-2.5 rounded hover:bg-ochre/[0.07] transition-all">
          ← All languages
        </Link>
      </div>
    );
  }

  // Group translations by category
  const grouped = new Map<string, typeof translations>();
  for (const t of translations) {
    const cat = t.concept_category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(t);
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-ink3 mb-5">
        <Link href="/" className="hover:text-ochre-d transition-colors">Home</Link>
        <span className="text-ink3/40">/</span>
        <Link href="/browse" className="hover:text-ochre-d transition-colors">Browse</Link>
        <span className="text-ink3/40">/</span>
        <Link href="/browse/languages" className="hover:text-ochre-d transition-colors">Languages</Link>
        <span className="text-ink3/40">/</span>
        <span className="text-ink2">{lang.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-bold text-ink leading-tight">
            {lang.name}
          </h1>
          <span className="font-[family-name:var(--font-dm-mono)] text-[13px] text-ink3">
            {lang.code}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink3">
          {lang.family && <span>Family: <strong className="text-ink2 font-medium">{lang.family}</strong></span>}
          {lang.script && <span>Script: <strong className="text-ink2 font-medium">{lang.script}</strong></span>}
          <span>{lang.translation_count} word{lang.translation_count !== 1 ? "s" : ""}</span>
        </div>
        {lang.regions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {lang.regions.map((r) => (
              <Link
                key={r}
                href={`/browse/countries/${encodeURIComponent(r)}`}
                className="text-[11px] bg-ochre/[0.08] text-ochre-d px-2.5 py-1 rounded-[3px] tracking-[0.04em] no-underline hover:bg-ochre/[0.15] transition-colors"
              >
                {r}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Translations grouped by category */}
      {translations.length === 0 ? (
        <div className="bg-cream border border-border rounded-lg px-6 py-10 text-center">
          <p className="text-ink3 text-[14px]">No translations yet for {lang.name}.</p>
        </div>
      ) : (
        [...grouped.entries()].map(([cat, items]) => (
          <div key={cat} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-[11px] font-medium text-ink3 tracking-[0.1em] uppercase">
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>
              <span className="text-[11px] text-ink3/50">{items.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 bg-cream border border-border rounded-lg overflow-hidden">
              {items.map((t) => (
                <Link
                  key={t.id}
                  href={`/words/${t.concept_slug}?lang=${lang.code}`}
                  className="block px-5 py-4 border-r border-b border-border hover:bg-ochre/[0.03] transition-colors group no-underline"
                >
                  <div className="font-[family-name:var(--font-cormorant)] text-[24px] font-semibold text-ink group-hover:text-ochre-d transition-colors leading-tight">
                    {t.word}
                  </div>
                  <div className="text-[12px] text-ink3 mt-1">
                    {t.concept_term}
                  </div>
                  {t.ethnic_group && (
                    <div className="text-[10px] text-ink3/60 mt-1">
                      {t.ethnic_group.name}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}

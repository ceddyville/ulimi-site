import { getConcept, listConcepts, getLanguage, getLanguageTranslations, getOtherMeanings } from "@/lib/api";
import type { Metadata } from "next";
import type { ConceptDetail, ConceptListItem, TranslationWithConcept, LanguageWithCount } from "@/lib/types";
import Link from "next/link";
import WordDetail from "./WordDetail";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
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

export default async function WordPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang: langCode } = await searchParams;

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
          The word &ldquo;{slug}&rdquo; doesn&apos;t exist in the dictionary yet.
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

  // Fetch similar words from same category (exclude current concept)
  let similarWords: ConceptListItem[] = [];
  try {
    const data = await listConcepts({ category: concept.category });
    similarWords = data.results
      .filter((c) => c.slug !== concept.slug)
      .slice(0, 8);
  } catch {
    // Non-critical — page still works without similar words
  }

  // If a language is specified, fetch language info + more words from that language
  let featuredLang: LanguageWithCount | null = null;
  let moreInLanguage: TranslationWithConcept[] = [];

  if (langCode) {
    try {
      const [langInfo, langTranslations] = await Promise.all([
        getLanguage(langCode),
        getLanguageTranslations(langCode),
      ]);
      featuredLang = langInfo;
      moreInLanguage = langTranslations
        .filter((t) => t.concept_slug !== concept.slug && t.concept_category === concept.category)
        .slice(0, 8);
    } catch {
      // Fall back to default view
    }
  }

  // Fetch other meanings for each unique word in the concept's translations (parallel)
  const otherMeaningsMap: Record<string, ConceptDetail[]> = {};
  const seenWords = new Set<string>();
  const uniqueTranslations: { word: string; langCode: string; langName: string }[] = [];
  for (const t of concept.translations) {
    for (const lang of t.languages) {
      const key = `${t.word.toLowerCase()}|${lang.code}`;
      if (seenWords.has(key)) continue;
      seenWords.add(key);
      uniqueTranslations.push({ word: t.word, langCode: lang.code, langName: lang.name });
    }
  }

  const otherResults = await Promise.allSettled(
    uniqueTranslations.map((t) => getOtherMeanings(concept.slug, t.word, t.langCode))
  );
  otherResults.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value.length > 0) {
      const t = uniqueTranslations[i];
      otherMeaningsMap[`${t.word} (${t.langName})`] = result.value;
    }
  });

  return (
    <WordDetail
      concept={concept}
      similarWords={similarWords}
      featuredLang={featuredLang}
      moreInLanguage={moreInLanguage}
      otherMeaningsMap={otherMeaningsMap}
    />
  );
}

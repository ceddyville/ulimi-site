import HomeContent from "./HomeContent";
import type { HeroCard } from "./HomeContent";
import { getDictionaryStats, listLanguages, listCountries, getConcept } from "@/lib/api";
import { REGION_NAMES } from "@/lib/regions";

const CATEGORY_LABELS: Record<string, string> = {
  animals: "Animals", food: "Food & Plants", nature: "Nature",
  family: "Family & Social", culture: "Culture & Governance", body: "Body & Health",
  spiritual: "Spiritual & Ceremonial", tools: "Tools & Technology",
  geography: "Geography & Place", time: "Time & Seasons", money: "Money & Trade",
  clothing: "Clothing & Appearance", emotions: "Emotions & Feelings",
  colors: "Colors & Patterns", numbers: "Numbers & Counting",
  actions: "Actions & Verbs", measurement: "Measurement & Size", other: "Other",
};

// Fallback shown if the API is unreachable on first load
const FALLBACK_HERO: HeroCard = {
  slug: "rain",
  title: "Rain",
  category: "Nature",
  rows: [
    { lang: "Swahili",  word: "Mvua",   note: "" },
    { lang: "Zulu",     word: "Imvula", note: "sacred at royal kraal" },
    { lang: "Luo",      word: "Koth",   note: "rainmaker: Onjinjo" },
    { lang: "Kikuyu",   word: "Mũũgũ", note: "prayers to Ngai" },
    { lang: "Hausa",    word: "Ruwa",   note: "also means water" },
  ],
  context: "Rain ceremonies and rainmakers were central to pre-colonial governance across the continent.",
};

export default async function HomePage() {
  let stats = { languages: 0, concepts: 0, translations: 0, countries: 0 };
  let heroCard: HeroCard = FALLBACK_HERO;

  try {
    const [dictStats, languages, countries, rainConcept] = await Promise.all([
      getDictionaryStats(),
      listLanguages({ min_words: 20 }),
      listCountries({ min_words: 20 }),
      getConcept("rain").catch(() => null),
    ]);
    stats = {
      languages: languages.length,
      concepts: dictStats.concept_count,
      translations: dictStats.translation_count,
      countries: countries.filter((c) => !REGION_NAMES.has(c.name)).length,
    };
    if (rainConcept && rainConcept.translations.length > 0) {
      // One row per language; prefer the entry with a cultural note when dupes exist
      const byLang = new Map<string, typeof rainConcept.translations[0]>();
      for (const t of rainConcept.translations) {
        const langName = t.languages[0]?.name ?? "Unknown";
        const existing = byLang.get(langName);
        if (!existing || (!existing.cultural_note && t.cultural_note)) {
          byLang.set(langName, t);
        }
      }
      const rows = [...byLang.values()].slice(0, 5).map((t) => ({
        lang: t.languages[0]?.name ?? "Unknown",
        word: t.word,
        note: t.cultural_note,
      }));
      heroCard = {
        slug: rainConcept.slug,
        title: rainConcept.english_term,
        category: CATEGORY_LABELS[rainConcept.category] ?? rainConcept.category,
        rows,
        context: rainConcept.precolonial_context,
      };
    }
  } catch (e) {
    console.error("Homepage fetch failed:", e);
  }

  return <HomeContent stats={stats} heroCard={heroCard} />;
}

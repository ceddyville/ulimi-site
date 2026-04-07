import HomeContent from "./HomeContent";
import { listConcepts, listLanguages, listCountries } from "@/lib/api";

export default async function HomePage() {
  let stats = { languages: 0, words: 0, countries: 0 };
  try {
    const [concepts, languages, countries] = await Promise.all([
      listConcepts(),
      listLanguages({ min_words: 20 }),
      listCountries({ min_words: 20 }),
    ]);
    stats = {
      languages: languages.length,
      words: concepts.count,
      countries: countries.length,
    };
  } catch (e) {
    console.error("Homepage stats fetch failed:", e);
    // Fall back to zeros — page still works
  }

  return <HomeContent stats={stats} />;
}

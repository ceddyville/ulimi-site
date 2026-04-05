import { Suspense } from "react";
import HomeContent from "./HomeContent";
import { listConcepts, listLanguages, listCountries } from "@/lib/api";

export default async function HomePage() {
  let stats = { languages: 0, words: 0, countries: 0 };
  try {
    const [concepts, languages, countries] = await Promise.all([
      listConcepts(),
      listLanguages(),
      listCountries(),
    ]);
    stats = {
      languages: languages.length,
      words: concepts.count,
      countries: countries.length,
    };
  } catch {
    // Fall back to zeros — page still works
  }

  return (
    <Suspense>
      <HomeContent stats={stats} />
    </Suspense>
  );
}

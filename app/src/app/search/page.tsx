import { redirect } from "next/navigation";
import type { ConceptDetail } from "@/lib/types";
import { searchConcepts } from "@/lib/api";
import SearchResults from "./SearchResults";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  if (!query) redirect("/");

  let results: ConceptDetail[];
  try {
    results = await searchConcepts(query);
  } catch {
    results = [];
  }

  return <SearchResults query={query} results={results} />;
}

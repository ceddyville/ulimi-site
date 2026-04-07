import Link from "next/link";
import type { Metadata } from "next";
import { listCountries } from "@/lib/api";
import type { CountrySummary } from "@/lib/types";
import { REGIONS, REGION_NAMES } from "@/lib/regions";
import CountriesContent from "./CountriesContent";

export const metadata: Metadata = {
  title: "Countries — Ulimi",
  description: "Browse African languages by country and region.",
};

export default async function CountriesPage() {
  let allCountries: CountrySummary[];
  try {
    allCountries = await listCountries({ min_words: 20 });
  } catch {
    allCountries = [];
  }

  // Remove region entries (e.g. "East Africa") from the country list
  const countries = allCountries.filter((c) => !REGION_NAMES.has(c.name));

  // Only include regions that have at least one country present in the data
  const countryNames = new Set(countries.map((c) => c.name));
  const activeRegions = Object.entries(REGIONS)
    .filter(([, members]) => members.some((m) => countryNames.has(m)))
    .map(([name, members]) => ({ name, members }));

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-ink3 mb-5">
        <Link href="/" className="hover:text-ochre-d transition-colors">Home</Link>
        <span className="text-ink3/40">/</span>
        <Link href="/browse" className="hover:text-ochre-d transition-colors">Browse</Link>
        <span className="text-ink3/40">/</span>
        <span className="text-ink2">Countries</span>
      </div>

      <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-bold text-ink leading-tight mb-2">
        Countries &amp; Regions
      </h1>
      <p className="text-[15px] text-ink3 mb-10 font-light">
        {countries.length} countries represented
      </p>

      <CountriesContent countries={countries} regions={activeRegions} />
    </>
  );
}

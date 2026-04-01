import Link from "next/link";
import type { Metadata } from "next";
import { listCountries } from "@/lib/api";
import type { CountrySummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "Countries — Ulimi",
  description: "Browse African languages by country and region.",
};

export default async function CountriesPage() {
  let countries: CountrySummary[];
  try {
    countries = await listCountries();
  } catch {
    countries = [];
  }

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
        {countries.length} countries and regions represented
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => (
          <Link
            key={country.name}
            href={`/browse/countries/${encodeURIComponent(country.name)}`}
            className="block bg-cream border border-border rounded-[10px] overflow-hidden hover:border-border2 transition-colors group no-underline"
          >
            <div className="px-5 py-5">
              <div className="font-[family-name:var(--font-cormorant)] text-[22px] font-semibold text-ink mb-2 group-hover:text-ochre-d transition-colors">
                {country.name}
              </div>
              <div className="text-[12px] text-ink3 mb-2.5">
                {country.language_count} language{country.language_count !== 1 ? "s" : ""}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {country.languages.map((l) => (
                  <span
                    key={l.code}
                    className="text-[10px] bg-ochre/[0.06] text-ochre-d px-2 py-0.5 rounded-[3px] tracking-[0.03em]"
                  >
                    {l.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

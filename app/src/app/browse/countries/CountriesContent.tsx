"use client";

import { useState } from "react";
import Link from "next/link";
import type { CountrySummary } from "@/lib/types";

interface Region {
  name: string;
  members: string[];
}

interface Props {
  countries: CountrySummary[];
  regions: Region[];
}

export default function CountriesContent({ countries, regions }: Props) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const filtered = activeRegion
    ? countries.filter((c) => {
        const region = regions.find((r) => r.name === activeRegion);
        return region?.members.includes(c.name);
      })
    : countries;

  return (
    <>
      {/* Region filter buttons */}
      {regions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveRegion(null)}
            className={`text-[12px] px-4 py-2 rounded-[6px] border transition-colors cursor-pointer ${
              activeRegion === null
                ? "bg-ink text-cream border-ink"
                : "bg-cream text-ink3 border-border hover:border-border2 hover:text-ink2"
            }`}
          >
            All
          </button>
          {regions.map((region) => (
            <button
              key={region.name}
              onClick={() =>
                setActiveRegion(activeRegion === region.name ? null : region.name)
              }
              className={`text-[12px] px-4 py-2 rounded-[6px] border transition-colors cursor-pointer ${
                activeRegion === region.name
                  ? "bg-ink text-cream border-ink"
                  : "bg-cream text-ink3 border-border hover:border-border2 hover:text-ink2"
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      )}

      {/* Country cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((country) => (
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

      {filtered.length === 0 && activeRegion && (
        <p className="text-[14px] text-ink3 text-center py-12">
          No countries with enough words in {activeRegion} yet.
        </p>
      )}
    </>
  );
}

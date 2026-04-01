import Link from "next/link";
import type { Metadata } from "next";
import { listCountries } from "@/lib/api";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const name = decodeURIComponent(country);
  return {
    title: `${name} — Ulimi`,
    description: `Languages and words from ${name} in the Ulimi dictionary.`,
  };
}

export async function generateStaticParams() {
  try {
    const countries = await listCountries();
    return countries.map((c) => ({ country: encodeURIComponent(c.name) }));
  } catch {
    return [];
  }
}

export default async function CountryDetailPage({ params }: Props) {
  const { country } = await params;
  const name = decodeURIComponent(country);

  let countryData;
  try {
    const all = await listCountries();
    countryData = all.find((c) => c.name === name);
  } catch {
    countryData = undefined;
  }

  if (!countryData) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-bold text-ink mb-3">
          Country not found
        </h1>
        <p className="text-ink3 text-sm mb-6">
          No data for &ldquo;{name}&rdquo; in the dictionary.
        </p>
        <Link href="/browse/countries" className="text-sm font-medium text-ochre-d border border-border2 px-5 py-2.5 rounded hover:bg-ochre/[0.07] transition-all">
          ← All countries
        </Link>
      </div>
    );
  }

  const totalWords = countryData.languages.reduce((s, l) => s + l.translation_count, 0);

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-ink3 mb-5">
        <Link href="/" className="hover:text-ochre-d transition-colors">Home</Link>
        <span className="text-ink3/40">/</span>
        <Link href="/browse" className="hover:text-ochre-d transition-colors">Browse</Link>
        <span className="text-ink3/40">/</span>
        <Link href="/browse/countries" className="hover:text-ochre-d transition-colors">Countries</Link>
        <span className="text-ink3/40">/</span>
        <span className="text-ink2">{name}</span>
      </div>

      <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-bold text-ink leading-tight mb-2">
        {name}
      </h1>
      <p className="text-[15px] text-ink3 mb-10 font-light">
        {countryData.language_count} language{countryData.language_count !== 1 ? "s" : ""} · {totalWords} total word{totalWords !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {countryData.languages.map((lang) => (
          <Link
            key={lang.code}
            href={`/browse/languages/${lang.code}`}
            className="block bg-cream border border-border rounded-[10px] overflow-hidden hover:border-border2 transition-colors group no-underline"
          >
            <div className="px-5 py-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-[family-name:var(--font-cormorant)] text-[24px] font-semibold text-ink group-hover:text-ochre-d transition-colors">
                  {lang.name}
                </span>
                <span className="font-[family-name:var(--font-dm-mono)] text-[11px] text-ink3">
                  {lang.code}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px] text-ink3">
                <span>{lang.family}</span>
                <span>{lang.translation_count} word{lang.translation_count !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

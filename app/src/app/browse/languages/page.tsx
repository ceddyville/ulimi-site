import Link from "next/link";
import type { Metadata } from "next";
import { listLanguages } from "@/lib/api";
import type { LanguageWithCount } from "@/lib/types";

export const metadata: Metadata = {
  title: "Languages — Ulimi",
  description: "Browse all African languages in the Ulimi dictionary.",
};

export default async function LanguagesPage() {
  let languages: LanguageWithCount[];
  try {
    languages = await listLanguages();
  } catch {
    languages = [];
  }

  // Group by family
  const families = new Map<string, typeof languages>();
  for (const lang of languages) {
    const fam = lang.family || "Other";
    if (!families.has(fam)) families.set(fam, []);
    families.get(fam)!.push(lang);
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-ink3 mb-5">
        <Link href="/" className="hover:text-ochre-d transition-colors">Home</Link>
        <span className="text-ink3/40">/</span>
        <Link href="/browse" className="hover:text-ochre-d transition-colors">Browse</Link>
        <span className="text-ink3/40">/</span>
        <span className="text-ink2">Languages</span>
      </div>

      <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-bold text-ink leading-tight mb-2">
        Languages
      </h1>
      <p className="text-[15px] text-ink3 mb-10 font-light">
        {languages.length} languages across {families.size} language families
      </p>

      {[...families.entries()].map(([family, langs]) => (
        <div key={family} className="mb-8">
          <h2 className="text-[11px] font-medium text-ink3 tracking-[0.1em] uppercase mb-3">
            {family} <span className="text-ink3/50">· {langs.length}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 bg-cream border border-border rounded-lg overflow-hidden">
            {langs.map((lang) => (
              <Link
                key={lang.code}
                href={`/browse/languages/${lang.code}`}
                className="block px-5 py-4 border-r border-b border-border hover:bg-ochre/[0.03] transition-colors group no-underline"
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-[family-name:var(--font-cormorant)] text-[22px] font-semibold text-ink group-hover:text-ochre-d transition-colors">
                    {lang.name}
                  </span>
                  <span className="font-[family-name:var(--font-dm-mono)] text-[11px] text-ink3">
                    {lang.code}
                  </span>
                </div>
                <div className="text-[12px] text-ink3">
                  {lang.translation_count} word{lang.translation_count !== 1 ? "s" : ""}
                  {lang.regions.length > 0 && (
                    <span className="ml-1.5 text-ink3/60">· {lang.regions.slice(0, 2).join(", ")}{lang.regions.length > 2 ? ` +${lang.regions.length - 2}` : ""}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

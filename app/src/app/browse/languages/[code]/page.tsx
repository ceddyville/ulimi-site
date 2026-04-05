import Link from "next/link";
import type { Metadata } from "next";
import { getLanguage, getLanguageTranslations, listLanguages } from "@/lib/api";
import LanguageDetail from "./LanguageDetail";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  try {
    const lang = await getLanguage(code);
    return {
      title: `${lang.name} — Ulimi`,
      description: `Browse ${lang.translation_count} ${lang.name} words in the Ulimi dictionary.`,
    };
  } catch {
    return { title: "Language not found — Ulimi" };
  }
}

export async function generateStaticParams() {
  try {
    const languages = await listLanguages();
    return languages.map((l) => ({ code: l.code }));
  } catch {
    return [];
  }
}

export default async function LanguageDetailPage({ params }: Props) {
  const { code } = await params;

  let lang, translations;
  try {
    [lang, translations] = await Promise.all([
      getLanguage(code),
      getLanguageTranslations(code),
    ]);
  } catch {
    return (
      <div className="py-20 text-center">
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-bold text-ink mb-3">
          Language not found
        </h1>
        <p className="text-ink3 text-sm mb-6">
          No language with code &ldquo;{code}&rdquo; exists in the dictionary.
        </p>
        <Link href="/browse/languages" className="text-sm font-medium text-ochre-d border border-border2 px-5 py-2.5 rounded hover:bg-ochre/[0.07] transition-all">
          ← All languages
        </Link>
      </div>
    );
  }

  return <LanguageDetail lang={lang} translations={translations} />;
}

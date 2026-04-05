import Link from "next/link";
import type { Metadata } from "next";
import { listAllConcepts, listCategories } from "@/lib/api";
import type { ConceptListItem } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  animals: "Animals",
  food: "Food & Plants",
  nature: "Nature",
  family: "Family & Social",
  culture: "Culture & Governance",
  body: "Body & Health",
  spiritual: "Spiritual & Ceremonial",
  tools: "Tools & Technology",
  geography: "Geography & Place",
  time: "Time & Seasons",
  money: "Money & Trade",
  clothing: "Clothing & Appearance",
  emotions: "Emotions & Feelings",
  colors: "Colors & Patterns",
  numbers: "Numbers & Counting",
  actions: "Actions & Verbs",
  measurement: "Measurement & Size",
  other: "Other",
};

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = CATEGORY_LABELS[category] ?? category;
  return {
    title: `${label} — Ulimi`,
    description: `Browse all ${label.toLowerCase()} words in the Ulimi dictionary.`,
  };
}

export async function generateStaticParams() {
  try {
    const categories = await listCategories();
    return categories.map((c) => ({ category: c.value }));
  } catch {
    return [];
  }
}

export default async function CategoryDetailPage({ params }: Props) {
  const { category } = await params;
  const label = CATEGORY_LABELS[category] ?? category;

  let concepts: ConceptListItem[];
  try {
    concepts = await listAllConcepts({ category });
  } catch {
    concepts = [];
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-ink3 mb-5">
        <Link href="/" className="hover:text-ochre-d transition-colors">Home</Link>
        <span className="text-ink3/40">/</span>
        <Link href="/browse" className="hover:text-ochre-d transition-colors">Browse</Link>
        <span className="text-ink3/40">/</span>
        <Link href="/browse/categories" className="hover:text-ochre-d transition-colors">Categories</Link>
        <span className="text-ink3/40">/</span>
        <span className="text-ink2">{label}</span>
      </div>

      <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-bold text-ink leading-tight mb-2">
        {label}
      </h1>
      <p className="text-[15px] text-ink3 mb-10 font-light">
        {concepts.length} word{concepts.length !== 1 ? "s" : ""}
      </p>

      {concepts.length === 0 ? (
        <div className="bg-cream border border-border rounded-lg px-6 py-10 text-center">
          <p className="text-ink3 text-[14px]">No words found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 bg-cream border border-border rounded-lg overflow-hidden">
          {concepts.map((concept) => (
            <Link
              key={concept.id}
              href={`/words/${concept.slug}`}
              className="block px-5 py-4 border-r border-b border-border hover:bg-ochre/[0.03] transition-colors group no-underline"
            >
              <div className="font-[family-name:var(--font-cormorant)] text-[22px] font-semibold text-ink group-hover:text-ochre-d transition-colors">
                {concept.english_term}
              </div>
              <div className="text-[12px] text-ink3 mt-1">
                {concept.translation_count} translation{concept.translation_count !== 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

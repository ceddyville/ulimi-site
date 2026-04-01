import Link from "next/link";
import type { Metadata } from "next";
import { listCategories } from "@/lib/api";
import type { CategorySummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "Categories — Ulimi",
  description: "Browse African words by category: animals, nature, family, culture, and more.",
};

const CATEGORY_ICONS: Record<string, string> = {
  animals: "🦁",
  food: "🌿",
  nature: "🌍",
  family: "👥",
  culture: "🏛️",
  body: "🫀",
  spiritual: "✨",
  tools: "🔧",
  geography: "🗺️",
  other: "📝",
};

export default async function CategoriesPage() {
  let categories: CategorySummary[];
  try {
    categories = await listCategories();
  } catch {
    categories = [];
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-ink3 mb-5">
        <Link href="/" className="hover:text-ochre-d transition-colors">Home</Link>
        <span className="text-ink3/40">/</span>
        <Link href="/browse" className="hover:text-ochre-d transition-colors">Browse</Link>
        <span className="text-ink3/40">/</span>
        <span className="text-ink2">Categories</span>
      </div>

      <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-bold text-ink leading-tight mb-2">
        Categories
      </h1>
      <p className="text-[15px] text-ink3 mb-10 font-light">
        {categories.length} categories · {categories.reduce((s, c) => s + c.concept_count, 0)} words
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.value}
            href={`/browse/categories/${cat.value}`}
            className="block bg-cream border border-border rounded-[10px] overflow-hidden hover:border-border2 transition-colors group no-underline"
          >
            <div className="px-5 py-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[28px]">{CATEGORY_ICONS[cat.value] ?? "📝"}</span>
                <div className="font-[family-name:var(--font-cormorant)] text-[24px] font-bold text-ink group-hover:text-ochre-d transition-colors">
                  {cat.label}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink3">
                  {cat.concept_count} word{cat.concept_count !== 1 ? "s" : ""}
                </span>
                <span className="text-[11px] text-ochre-d font-medium tracking-[0.06em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

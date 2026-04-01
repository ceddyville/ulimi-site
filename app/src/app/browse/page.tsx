import Link from "next/link";

const sections = [
  {
    title: "Categories",
    desc: "Animals, nature, body, family — browse words grouped by meaning.",
    href: "/browse/categories",
    accent: "🦁",
  },
  {
    title: "Languages",
    desc: "Swahili, Zulu, Luo, Shona — explore the dictionary language by language.",
    href: "/browse/languages",
    accent: "🗣️",
  },
  {
    title: "Countries",
    desc: "Kenya, South Africa, Zimbabwe — discover which languages are spoken where.",
    href: "/browse/countries",
    accent: "🌍",
  },
];

export default function BrowsePage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-ink3 mb-5">
        <Link href="/" className="hover:text-ochre-d transition-colors">Home</Link>
        <span className="text-ink3/40">/</span>
        <span className="text-ink2">Browse</span>
      </div>

      <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-bold text-ink leading-tight mb-3">
        Browse the dictionary
      </h1>
      <p className="text-[15px] text-ink3 mb-10 max-w-[500px] font-light leading-[1.75]">
        Explore African words by topic, language, or country.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block bg-cream border border-border rounded-[10px] overflow-hidden hover:border-border2 transition-colors group no-underline"
          >
            <div className="px-6 py-8">
              <div className="text-[36px] mb-3">{s.accent}</div>
              <div className="font-[family-name:var(--font-cormorant)] text-[28px] font-bold text-ink mb-2 group-hover:text-ochre-d transition-colors">
                {s.title}
              </div>
              <p className="text-[13px] text-ink3 leading-[1.7] mb-4">{s.desc}</p>
              <span className="text-[11px] text-ochre-d font-medium tracking-[0.06em] uppercase">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

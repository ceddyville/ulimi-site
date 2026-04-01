import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink px-12 py-9 flex items-start justify-between flex-wrap gap-6">
      <div>
        <div className="font-[family-name:var(--font-cormorant)] text-lg text-cream">
          <span className="text-ochre-l">ulimi</span>.dev — The African Tongue
        </div>
        <div className="text-[11px] text-cream/40 tracking-[0.05em]">
          Open source · Community contributed
        </div>
      </div>

      <div className="flex gap-12">
        <div>
          <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-cream/35 mb-2.5">
            Dictionary
          </div>
          <Link href="/#search" className="block text-[13px] text-cream/55 no-underline mb-[7px] hover:text-cream transition-colors">
            Search
          </Link>
          <Link href="/#contribute" className="block text-[13px] text-cream/55 no-underline mb-[7px] hover:text-cream transition-colors">
            Contribute
          </Link>
        </div>
        <div>
          <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-cream/35 mb-2.5">
            Browse
          </div>
          <Link href="/browse/categories" className="block text-[13px] text-cream/55 no-underline mb-[7px] hover:text-cream transition-colors">
            Categories
          </Link>
          <Link href="/browse/languages" className="block text-[13px] text-cream/55 no-underline mb-[7px] hover:text-cream transition-colors">
            Languages
          </Link>
          <Link href="/browse/countries" className="block text-[13px] text-cream/55 no-underline mb-[7px] hover:text-cream transition-colors">
            Countries
          </Link>
        </div>
        <div>
          <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-cream/35 mb-2.5">
            Developers
          </div>
          <Link href="/docs" className="block text-[13px] text-cream/55 no-underline mb-[7px] hover:text-cream transition-colors">
            API Docs
          </Link>
          <a
            href="https://github.com/ceddyville/ulimi-api"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[13px] text-cream/55 no-underline mb-[7px] hover:text-cream transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

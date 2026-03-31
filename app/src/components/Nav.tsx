import Link from "next/link";

const UlimiLogo = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <ellipse cx="10" cy="10" rx="7" ry="4.5" fill="none" stroke="#C8873A" strokeWidth="1.5" />
    <path
      d="M10 5.5 Q14.5 7.5 14.5 10 Q14.5 12.5 10 14.5"
      fill="none"
      stroke="#C8873A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12.5" cy="10" r="1.5" fill="#E8AA6A" />
  </svg>
);

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-12 py-[18px] border-b border-border sticky top-0 z-50 bg-bg/95 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div className="w-[38px] h-[38px] rounded-lg bg-ink flex items-center justify-center shrink-0">
          <UlimiLogo />
        </div>
        <span className="font-[family-name:var(--font-cormorant)] text-[22px] font-semibold text-ink">
          ulimi
        </span>
        <span className="text-[10px] text-ink3 tracking-[0.12em] uppercase border-l border-border pl-3">
          The African Tongue
        </span>
      </Link>

      <div className="flex gap-7 items-center">
        <Link href="/#search" className="text-ink3 text-[13px] no-underline tracking-[0.02em] hover:text-ink transition-colors">
          Dictionary
        </Link>
        <Link href="/#contribute" className="text-ink3 text-[13px] no-underline tracking-[0.02em] hover:text-ink transition-colors">
          Contribute
        </Link>
        <Link
          href="/docs"
          className="bg-ink text-cream px-5 py-2 rounded text-[12px] font-medium tracking-[0.06em] uppercase no-underline hover:bg-ochre-d transition-colors"
        >
          API Docs
        </Link>
      </div>
    </nav>
  );
}

"use client";

interface NoResultProps {
  query: string;
  onAddConcept: (term: string) => void;
}

export default function NoResult({ query, onAddConcept }: NoResultProps) {
  return (
    <div className="bg-cream border border-border rounded-[10px] px-7 py-9 text-center">
      <div className="font-[family-name:var(--font-cormorant)] text-[32px] font-bold text-ink mb-2.5">
        &ldquo;{query}&rdquo;
      </div>
      <p className="text-[13px] text-ink3 mb-6 leading-[1.65]">
        This word isn&rsquo;t in the dictionary yet.<br />
        You could be the first to add{" "}
        <em className="text-ochre-d not-italic font-medium">{query}</em> — and every language you know for it.
      </p>
      <button
        onClick={() => onAddConcept(query)}
        className="bg-ink text-cream border-none rounded px-[30px] py-[13px] text-[13px] font-medium cursor-pointer font-[family-name:var(--font-jost)] tracking-[0.05em] uppercase transition-colors hover:bg-ochre-d"
      >
        Add &ldquo;{query}&rdquo; to Ulimi →
      </button>
    </div>
  );
}

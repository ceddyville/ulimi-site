"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export default function SearchBar({ onSearch, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <div className="flex gap-2.5">
      <input
        type="text"
        className="flex-1 bg-cream border border-border rounded px-[18px] py-[13px] text-ink text-[15px] font-[family-name:var(--font-jost)] outline-none transition-colors focus:border-ochre placeholder:text-ink3"
        placeholder="lion, simba, ubuntu, mama, mvua…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />
      <button
        onClick={handleSubmit}
        className="bg-ink text-cream border-none rounded px-7 py-[13px] text-[12px] font-medium cursor-pointer font-[family-name:var(--font-jost)] tracking-[0.08em] uppercase transition-colors hover:bg-ochre-d"
      >
        Search
      </button>
    </div>
  );
}

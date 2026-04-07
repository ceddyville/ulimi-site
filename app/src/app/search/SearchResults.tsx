"use client";

import { useState } from "react";
import type { ConceptDetail, ContributionType } from "@/lib/types";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import NoResult from "@/components/NoResult";
import ContributeModal from "@/components/ContributeModal";

interface Props {
  query: string;
  results: ConceptDetail[];
}

export default function SearchResults({ query, results }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ContributionType>("new_concept");
  const [modalPrefill, setModalPrefill] = useState<{
    conceptTerm?: string;
    conceptId?: string;
    langName?: string;
    word?: string;
    translationId?: string;
  }>({});

  return (
    <>
      <Nav />

      <main className="max-w-[1000px] mx-auto px-12 pt-10 pb-20">
        <div className="mb-6">
          <SearchBar defaultValue={query} />
        </div>

        {results.length > 0 && (
          <p className="text-[13px] text-ink3 mb-6">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}

        {results.length === 0 && (
          <NoResult
            query={query}
            onAddConcept={(term) => {
              setModalType("new_concept");
              setModalPrefill({ conceptTerm: term });
              setModalOpen(true);
            }}
          />
        )}

        {results.map((concept) => (
          <div key={concept.id} className="mb-4">
            <ResultCard concept={concept} />
          </div>
        ))}
      </main>

      <Footer />

      <ContributeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialType={modalType}
        prefill={modalPrefill}
      />
    </>
  );
}

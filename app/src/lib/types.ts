export interface Language {
  id: string;
  code: string;
  name: string;
  family: string;
  script: string;
  regions: string[];
}

export interface EthnicGroup {
  id: string;
  name: string;
  country_iso2: string;
  kabila_id: string | null;
}

export interface Translation {
  id: string;
  word: string;
  phonetic: string;
  cultural_note: string;
  source: string;
  is_precolonial: boolean;
  verified: boolean;
  language: Language;
  ethnic_group: EthnicGroup | null;
}

export interface ConceptListItem {
  id: string;
  slug: string;
  english_term: string;
  category: string;
  translation_count: number;
  verified: boolean;
}

export interface ConceptDetail {
  id: string;
  slug: string;
  english_term: string;
  category: string;
  precolonial_context: string;
  verified: boolean;
  translation_count: number;
  translations: Translation[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type ContributionType = "new_concept" | "new_translation" | "correction";

export interface ContributionPayload {
  contribution_type: ContributionType;
  concept?: string | null;
  existing_translation?: string | null;
  proposed_data: Record<string, unknown>;
  contributor_name: string;
  contributor_email: string;
  contributor_note: string;
}

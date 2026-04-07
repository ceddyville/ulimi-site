import type {
  ConceptDetail,
  ConceptListItem,
  ContributionPayload,
  PaginatedResponse,
  CategorySummary,
  LanguageWithCount,
  CountrySummary,
  TranslationWithConcept,
} from "./types";

const SERVER_API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!SERVER_API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is required");
}

// On the server (SSR), call the backend directly.
// In the browser, use the /proxy rewrite to avoid mixed-content (https→http) blocks.
function getApiBase() {
  if (typeof window === "undefined") return SERVER_API_BASE;
  return "/proxy/api/v1";
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiBase()}${path}`;
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init?.method && init.method !== "GET"
        ? { "Content-Type": "application/json" }
        : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status} ${url}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export function listConcepts(params?: {
  category?: string;
  page?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.category) sp.set("category", params.category);
  if (params?.page) sp.set("page", String(params.page));
  const qs = sp.toString();
  return apiFetch<PaginatedResponse<ConceptListItem>>(
    `/concepts/${qs ? `?${qs}` : ""}`
  );
}

export async function listAllConcepts(params?: { category?: string }) {
  const all: ConceptListItem[] = [];
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    const data = await listConcepts({ ...params, page });
    all.push(...data.results);
    hasNext = !!data.next;
    page++;
  }
  return all;
}

export function getConcept(slug: string) {
  return apiFetch<ConceptDetail>(`/concepts/${encodeURIComponent(slug)}/`);
}

export function searchConcepts(q: string, category?: string) {
  const sp = new URLSearchParams({ q });
  if (category) sp.set("category", category);
  return apiFetch<ConceptDetail[]>(
    `/concepts/search/?${sp.toString()}`
  );
}

export function getOtherMeanings(slug: string, word: string, langCode?: string) {
  const sp = new URLSearchParams({ word });
  if (langCode) sp.set("lang", langCode);
  return apiFetch<ConceptDetail[]>(
    `/concepts/${encodeURIComponent(slug)}/other-meanings/?${sp.toString()}`
  );
}

export function submitContribution(data: ContributionPayload) {
  return apiFetch<Record<string, unknown>>("/contributions/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ── Browse endpoints ──────────────────────────────────────────────────────── */

export function listCategories() {
  return apiFetch<CategorySummary[]>("/concepts/categories/");
}

export function listLanguages() {
  return apiFetch<LanguageWithCount[]>("/languages/");
}

export function getLanguage(code: string) {
  return apiFetch<LanguageWithCount>(`/languages/${encodeURIComponent(code)}/`);
}

export function getLanguageTranslations(code: string) {
  return apiFetch<TranslationWithConcept[]>(
    `/languages/${encodeURIComponent(code)}/translations/`
  );
}

export function listCountries() {
  return apiFetch<CountrySummary[]>("/languages/countries/");
}

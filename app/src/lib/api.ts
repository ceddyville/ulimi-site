import type {
  ConceptDetail,
  ConceptListItem,
  ContributionPayload,
  PaginatedResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://ulimi.dev/api/v1";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
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

export function submitContribution(data: ContributionPayload) {
  return apiFetch<Record<string, unknown>>("/contributions/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

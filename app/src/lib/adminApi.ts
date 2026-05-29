/**
 * Admin-only API helpers — all calls include `Authorization: Token <token>`.
 * Goes through /api/proxy so the token is never sent directly to an external
 * origin from the browser.
 */
import type { ConceptDetail, Translation, LanguageWithCount } from "./types";

const PROXY = "/api/proxy";

async function adminFetch<T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${PROXY}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
      ...init?.headers,
    },
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

/** Returns the auth token on success; throws on bad credentials. */
export async function adminLogin(username: string, password: string): Promise<string> {
  const res = await fetch(`${PROXY}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json();
  return data.token as string;
}

/** Verify the stored token is still valid; returns user info or throws. */
export function verifyToken(token: string) {
  return adminFetch<{ id: number; username: string; is_staff: boolean }>(
    "/auth/me/",
    token
  );
}

// ── Concepts ─────────────────────────────────────────────────────────────────

export function patchConcept(
  slug: string,
  data: Partial<Pick<ConceptDetail, "english_term" | "definition" | "category" | "precolonial_context" | "verified">>,
  token: string
) {
  return adminFetch<ConceptDetail>(`/concepts/${encodeURIComponent(slug)}/`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteConcept(slug: string, token: string) {
  return adminFetch<void>(`/concepts/${encodeURIComponent(slug)}/`, token, { method: "DELETE" });
}

// ── Translations ──────────────────────────────────────────────────────────────

export function patchTranslation(
  id: string,
  data: Partial<Pick<Translation, "word" | "phonetic" | "cultural_note" | "source" | "is_precolonial" | "verified">> & { language_codes?: string[] },
  token: string
) {
  return adminFetch<Translation>(`/translations/${id}/`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function createTranslation(
  data: {
    concept_slug: string;
    word: string;
    phonetic?: string;
    cultural_note?: string;
    source?: string;
    is_precolonial?: boolean;
    verified?: boolean;
    language_codes: string[];
  },
  token: string
) {
  return adminFetch<Translation>(`/translations/`, token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteTranslation(id: string, token: string) {
  return adminFetch<void>(`/translations/${id}/`, token, { method: "DELETE" });
}

// ── Languages ─────────────────────────────────────────────────────────────────

export function patchLanguage(
  code: string,
  data: Partial<Pick<LanguageWithCount, "name" | "family" | "script" | "regions">>,
  token: string
) {
  return adminFetch<LanguageWithCount>(`/languages/${code}/`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

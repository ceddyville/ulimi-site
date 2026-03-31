# Ulimi Site — Copilot Instructions

## Project

Frontend for Ulimi (ulimi.dev) — The African Tongue.
A Trans-African dictionary where users search, browse,
and contribute indigenous African words.

## Current state

HTML templates only — to be ported to Next.js (TypeScript).

- `index.html` — client-facing dictionary (Option C: earth tones)
- `docs.html` — developer API documentation (Option B: dark green)

## Design system — client site (index.html)

- Font: Cormorant Garamond (headings/words) + Jost (body)
- Palette: --bg #F5F0E8, --ink #2C1810, --ochre #C8873A, --cream #FAF6EE
- The ochre accent only appears for pre-colonial context — it signals heritage
- No references to other APIs or external ecosystems on any page

## Design system — docs site (docs.html)

- Font: Playfair Display (headings) + DM Mono (code) + DM Sans (body)
- Palette: --bg #0E1610, --primary #3DBD8F, --accent #C8873A

## Key components to build

- `SearchBar` — input + button, fires on Enter or click
- `ResultCard` — concept header + language grid + "Add translation" bar
- `NoResult` — word not found state + "Add to Ulimi" CTA
- `ContributeModal` — 3 tabs: new_concept / new_translation / correction
- `Nav` — sticky, shared across all pages
- `Footer` — two columns only: Dictionary and Developers

## Contribution modal rules

- "Why should we trust this?" is required — validate before submit
- Modal pre-fills based on which entry point triggered it
- On success show "Asante sana" with a type-specific message
- POST to /api/v1/contributions/ on submit

## What to avoid

- No links or references to other APIs (Kabila, Majina, Mipaka, Sarafu, Mzizi)
- No mention of Imara Tech on any user-facing page
- No ecosystem section — Ulimi stands alone for now
- Do not add footer columns beyond Dictionary and Developers

## API

- Base URL: https://ulimi.dev/api/v1/
- Search: GET /concepts/search/?q={term}
- Detail: GET /concepts/{slug}/
- Contribute: POST /contributions/
- All read endpoints are public — no auth needed for search/browse

## Related repos

- Backend: github.com/ceddyville/ulimi-api

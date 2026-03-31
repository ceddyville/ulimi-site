# Ulimi Site

Frontend for [ulimi.dev](https://ulimi.dev) — The African Tongue.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- Two design systems:
  - **Dictionary** (earth tones, Cormorant Garamond + Jost) — homepage, search, contribute
  - **Docs** (dark green, Playfair Display + DM Mono) — API documentation

## Setup

```bash
cd app
cp .env.example .env.local
npm install
npm run dev
```

The dev server runs at `http://localhost:3000` and expects the API at `http://127.0.0.1:8000/api/v1` (configurable via `NEXT_PUBLIC_API_URL` in `.env.local`).

## Pages

| Route   | Description                                                   |
| ------- | ------------------------------------------------------------- |
| `/`     | Dictionary homepage — hero, search, results, contribute modal |
| `/docs` | API documentation with endpoint reference                     |

## Project structure

```
app/
  src/
    app/
      page.tsx              Main dictionary page
      globals.css           Earth-tone design tokens + Tailwind config
      docs/
        page.tsx            Docs page
        docs.css            Dark-green design tokens
        DocsContent.tsx     Docs client component (sidebar + endpoint cards)
    components/
      Nav.tsx               Navigation bar
      Footer.tsx            Site footer
      SearchBar.tsx         Search input with category filters
      ResultCard.tsx        Concept search result card
      NoResult.tsx          Empty state with contribute CTA
      ContributeModal.tsx   3-tab contribution form (new concept / translation / correction)
    lib/
      api.ts                Typed API client (listConcepts, searchConcepts, submitContribution, etc.)
      types.ts              TypeScript interfaces (Language, Concept, Translation, Contribution)
```

## API

Connects to [ulimi-api](https://github.com/ceddyville/ulimi-api) at `ulimi.dev/api/v1/`.

## License

CC BY-SA 4.0

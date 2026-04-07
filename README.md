# Ulimi Site

Frontend for [ulimi.dev](https://ulimi.dev) — The African Tongue.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- Two design systems:
  - **Dictionary** (earth tones, Cormorant Garamond + Jost) — homepage, search, contribute
  - **Docs** (warm charcoal & ochre, Playfair Display + DM Mono) — API documentation
- Deployed on **Vercel** (auto-deploy from `main`)

## Setup

```bash
cd app
cp .env.example .env.local
npm install
npm run dev
```

The dev server runs at `http://localhost:3000` and expects the API at `http://127.0.0.1:8000/api/v1` (configurable via `NEXT_PUBLIC_API_URL` in `.env.local`).

## Pages

| Route                           | Description                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| `/`                             | Dictionary homepage — hero, live stats, search, contribute   |
| `/search?q=...`                 | Search results — auto-redirects on single match              |
| `/words/[slug]`                 | Word detail — translations, other meanings, related words    |
| `/browse/languages`             | All languages                                                |
| `/browse/languages/[code]`      | Language detail — words grouped by category, subtribe filter |
| `/browse/categories`            | All categories                                               |
| `/browse/categories/[category]` | Category detail — all words in a category                    |
| `/browse/countries`             | Countries with their languages                               |
| `/docs`                         | API documentation with endpoint reference                    |

## Project structure

```
app/
  src/
    app/
      page.tsx              Main dictionary page (fetches live stats)
      HomeContent.tsx        Homepage client component (hero, stats, contribute modal)
      globals.css           Earth-tone design tokens + Tailwind config
      search/
        page.tsx            Search results server component (redirects on single match)
        SearchResults.tsx    Search results client component
      words/[slug]/
        page.tsx            Word detail server component (other meanings)
        WordDetail.tsx      Word detail client component
      browse/
        languages/[code]/
          page.tsx          Language detail server component
          LanguageDetail.tsx Language detail client component (subtribe filter)
        categories/[category]/
          page.tsx          Category detail
      docs/
        page.tsx            Docs page
        docs.css            Warm charcoal & ochre design tokens
        DocsContent.tsx     Docs client component (sidebar + endpoint cards)
    components/
      Nav.tsx               Navigation bar
      Footer.tsx            Site footer
      SearchBar.tsx         Search input with category filters
      ResultCard.tsx        Concept search result card
      NoResult.tsx          Empty state with contribute CTA
      ContributeModal.tsx   3-tab contribution form (new concept / translation / correction)
    lib/
      api.ts                Typed API client (listConcepts, searchConcepts, getOtherMeanings, etc.)
      types.ts              TypeScript interfaces (Language, Concept, Translation, Contribution)
```

## API

Server components call `https://api.ulimi.dev/api/v1/` directly. Browser requests go through a Next.js API proxy route (`/api/proxy/[...path]`) to avoid CORS and mixed-content issues.

Connects to [ulimi-api](https://github.com/ceddyville/ulimi-api).

## License

CC BY-SA 4.0

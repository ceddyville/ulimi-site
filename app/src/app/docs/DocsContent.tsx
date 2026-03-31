"use client";

import Link from "next/link";

const DocsLogo = () => (
  <svg width="16" height="16" viewBox="0 0 20 20">
    <ellipse cx="10" cy="10" rx="7" ry="4.5" fill="none" stroke="#3DBD8F" strokeWidth="1.5" />
    <path d="M10 5.5 Q14.5 7.5 14.5 10 Q14.5 12.5 10 14.5" fill="none" stroke="#3DBD8F" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12.5" cy="10" r="1.5" fill="#3DBD8F" />
  </svg>
);

const SIDEBAR_SECTIONS: {
  label: string;
  links: { href: string; text: string; badge?: string }[];
}[] = [
  {
    label: "Getting started",
    links: [
      { href: "#intro", text: "Introduction" },
      { href: "#base-url", text: "Base URL" },
      { href: "#auth", text: "Authentication" },
      { href: "#rate-limits", text: "Rate limits" },
    ],
  },
  {
    label: "Concepts",
    links: [
      { href: "#list-concepts", text: "List concepts", badge: "GET" },
      { href: "#get-concept", text: "Get concept", badge: "GET" },
      { href: "#search", text: "Search", badge: "GET" },
    ],
  },
  {
    label: "Languages",
    links: [{ href: "#list-languages", text: "List languages", badge: "GET" }],
  },
  {
    label: "Contributions",
    links: [
      { href: "#submit", text: "Submit word", badge: "POST" },
      { href: "#vote", text: "Vote", badge: "POST" },
    ],
  },
  {
    label: "Reference",
    links: [
      { href: "#categories", text: "Categories" },
      { href: "#changelog", text: "Changelog" },
    ],
  },
];

const CATEGORIES = [
  { slug: "animals", label: "Animals" },
  { slug: "food", label: "Food & Plants" },
  { slug: "nature", label: "Nature" },
  { slug: "family", label: "Family & Social" },
  { slug: "culture", label: "Culture & Governance" },
  { slug: "body", label: "Body & Health" },
  { slug: "spiritual", label: "Spiritual & Ceremonial" },
  { slug: "tools", label: "Tools & Technology" },
  { slug: "geography", label: "Geography & Place" },
];

export default function DocsContent() {
  return (
    <>
      {/* Header */}
      <header className="doc-header">
        <div className="doc-header-left">
          <div className="doc-header-mark">
            <DocsLogo />
          </div>
          <span className="doc-header-name">ulimi</span>
          <span className="doc-header-badge">API Docs</span>
        </div>
        <div className="doc-header-right">
          <a href="#concepts">Concepts</a>
          <a href="#list-languages">Languages</a>
          <a href="#submit">Contributions</a>
          <Link href="/">← Dictionary</Link>
          <a
            href="https://github.com/ceddyville/ulimi-api"
            target="_blank"
            rel="noopener noreferrer"
            className="back-link"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="doc-sidebar">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.label} className="sidebar-section">
            <div className="sidebar-label">{section.label}</div>
            {section.links.map((link) => (
              <a key={link.href} href={link.href} className="sidebar-link">
                {link.badge && (
                  <span className={`method-badge ${link.badge === "GET" ? "badge-get" : "badge-post"}`}>
                    {link.badge}
                  </span>
                )}
                {link.text}
              </a>
            ))}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="doc-main">
        {/* Introduction */}
        <div id="intro" className="doc-section">
          <div className="page-title">
            Ulimi <em>API</em>
          </div>
          <p className="page-intro">
            A living, community-contributed dictionary of indigenous African words across languages, ethnic groups, and pre-colonial contexts. Free to use. Open source.
          </p>

          <div id="base-url" className="base-url">
            <span className="base-url-label">Base URL</span>
            <span className="base-url-value">https://ulimi.dev/api/v1</span>
          </div>

          <div className="callout callout-info">
            <strong>Open API —</strong> All read endpoints are public and require no authentication. Submit endpoints (POST) accept anonymous contributions but authenticated users get contribution history.
          </div>
        </div>

        {/* Concepts */}
        <div id="concepts" className="doc-section">
          <div className="doc-section-title">Concepts</div>
          <p className="doc-section-sub">
            A concept is the core entity — the idea or thing, language-agnostic. Each concept has many translations across different languages and ethnic groups.
          </p>

          {/* List concepts */}
          <div id="list-concepts" className="endpoint">
            <div className="endpoint-header">
              <span className="method method-get">GET</span>
              <span className="endpoint-path">/concepts/</span>
              <span className="endpoint-desc">List all verified concepts</span>
            </div>
            <div className="endpoint-body">
              <div className="params-label">Query parameters</div>
              <div className="param-row">
                <span className="param-name">category<span className="tag-optional">optional</span></span>
                <span className="param-type">string</span>
                <span className="param-desc">Filter by category slug — e.g. <code>animals</code>, <code>culture</code></span>
              </div>
              <div className="param-row">
                <span className="param-name">search<span className="tag-optional">optional</span></span>
                <span className="param-type">string</span>
                <span className="param-desc">Filter by English term. For cross-language search use <code>/search/</code> instead.</span>
              </div>
              <div className="param-row">
                <span className="param-name">page<span className="tag-optional">optional</span></span>
                <span className="param-type">integer</span>
                <span className="param-desc">Page number. Default: 1. Page size: 20.</span>
              </div>
              <div className="code-block" style={{ borderTop: "0.5px solid var(--doc-border)", borderRadius: "8px", marginTop: 18 }}>
                <div className="code-bar">
                  <div className="code-dot" style={{ background: "#8B3A2A" }} />
                  <div className="code-dot" style={{ background: "#C8873A" }} />
                  <div className="code-dot" style={{ background: "#2D4A35" }} />
                  <span className="code-label">curl</span>
                </div>
                <pre>{`curl https://ulimi.dev/api/v1/concepts/
curl https://ulimi.dev/api/v1/concepts/?category=animals`}</pre>
              </div>
            </div>
          </div>

          {/* Get concept */}
          <div id="get-concept" className="endpoint">
            <div className="endpoint-header">
              <span className="method method-get">GET</span>
              <span className="endpoint-path">/concepts/<span className="param">{"{slug}"}</span>/</span>
              <span className="endpoint-desc">Get a concept with all translations</span>
            </div>
            <div className="endpoint-body">
              <div className="params-label">Path parameters</div>
              <div className="param-row">
                <span className="param-name">slug<span className="tag-required">required</span></span>
                <span className="param-type">string</span>
                <span className="param-desc">URL-safe concept slug — e.g. <code>lion</code>, <code>ubuntu</code></span>
              </div>
              <div className="code-block" style={{ borderTop: "0.5px solid var(--doc-border)", borderRadius: "8px", marginTop: 18 }}>
                <div className="code-bar">
                  <div className="code-dot" style={{ background: "#8B3A2A" }} />
                  <div className="code-dot" style={{ background: "#C8873A" }} />
                  <div className="code-dot" style={{ background: "#2D4A35" }} />
                  <span className="code-label">response · 200 OK</span>
                </div>
                <pre>{`{
  "slug": "ubuntu",
  "english_term": "Ubuntu / Humanity",
  "category": "culture",
  "precolonial_context": "A pan-African philosophy...",
  "translations": [
    {
      "word": "Ubuntu",
      "phonetic": "oo-BOON-too",
      "language": { "code": "zu", "name": "Zulu" },
      "ethnic_group": { "name": "Zulu", "country_iso2": "ZA" }
    }
  ]
}`}</pre>
              </div>
            </div>
          </div>

          {/* Search */}
          <div id="search" className="endpoint">
            <div className="endpoint-header">
              <span className="method method-get">GET</span>
              <span className="endpoint-path">/concepts/search/</span>
              <span className="endpoint-desc">Cross-language search — any word, any language</span>
            </div>
            <div className="endpoint-body">
              <div className="callout callout-warn" style={{ marginBottom: 16 }}>
                <strong>This is the key endpoint.</strong> Unlike <code>/concepts/?search=</code>, this searches across ALL translation words simultaneously — so searching &ldquo;simba&rdquo; finds the Lion concept just as searching &ldquo;lion&rdquo; does.
              </div>
              <div className="params-label">Query parameters</div>
              <div className="param-row">
                <span className="param-name">q<span className="tag-required">required</span></span>
                <span className="param-type">string</span>
                <span className="param-desc">The search term. Minimum 2 characters.</span>
              </div>
              <div className="param-row">
                <span className="param-name">category<span className="tag-optional">optional</span></span>
                <span className="param-type">string</span>
                <span className="param-desc">Narrow results to a category.</span>
              </div>
              <div className="code-block" style={{ borderTop: "0.5px solid var(--doc-border)", borderRadius: "8px", marginTop: 18 }}>
                <div className="code-bar">
                  <div className="code-dot" style={{ background: "#8B3A2A" }} />
                  <div className="code-dot" style={{ background: "#C8873A" }} />
                  <div className="code-dot" style={{ background: "#2D4A35" }} />
                  <span className="code-label">curl</span>
                </div>
                <pre>{`curl "https://ulimi.dev/api/v1/concepts/search/?q=simba"
curl "https://ulimi.dev/api/v1/concepts/search/?q=ubuntu"`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div id="list-languages" className="doc-section">
          <div className="doc-section-title">Languages</div>
          <div className="endpoint">
            <div className="endpoint-header">
              <span className="method method-get">GET</span>
              <span className="endpoint-path">/languages/</span>
              <span className="endpoint-desc">List all supported languages</span>
            </div>
            <div className="endpoint-body">
              <div className="code-block" style={{ borderTop: "0.5px solid var(--doc-border)", borderRadius: "8px", marginTop: 18 }}>
                <div className="code-bar">
                  <div className="code-dot" style={{ background: "#8B3A2A" }} />
                  <div className="code-dot" style={{ background: "#C8873A" }} />
                  <div className="code-dot" style={{ background: "#2D4A35" }} />
                  <span className="code-label">curl</span>
                </div>
                <pre>{`curl https://ulimi.dev/api/v1/languages/`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Contributions */}
        <div id="contributions-section" className="doc-section">
          <div className="doc-section-title">Contributions</div>
          <p className="doc-section-sub">
            Anyone can submit new words or corrections. All submissions enter a pending state, can be upvoted by the community, and go live only after admin review.
          </p>

          <div id="submit" className="endpoint">
            <div className="endpoint-header">
              <span className="method method-post">POST</span>
              <span className="endpoint-path">/contributions/</span>
              <span className="endpoint-desc">Submit a new word, translation, or correction</span>
            </div>
            <div className="endpoint-body">
              <div className="params-label">Three contribution types</div>
              <div className="code-block" style={{ borderTop: "0.5px solid var(--doc-border)", borderRadius: "8px", marginTop: 18 }}>
                <div className="code-bar">
                  <div className="code-dot" style={{ background: "#8B3A2A" }} />
                  <div className="code-dot" style={{ background: "#C8873A" }} />
                  <div className="code-dot" style={{ background: "#2D4A35" }} />
                  <span className="code-label">new_concept · new_translation · correction</span>
                </div>
                <pre>{`// Type 1: Brand new concept
{
  "contribution_type": "new_concept",
  "contributor_name": "Achieng Otieno",
  "contributor_note": "Native Luo speaker from Kisumu",
  "proposed_data": {
    "english_term": "Baobab tree",
    "category": "food",
    "word": "Uyombo",
    "language_code": "luo",
    "is_precolonial": true
  }
}

// Type 2: New translation for existing concept
{
  "contribution_type": "new_translation",
  "concept": "<concept-uuid>",
  "proposed_data": {
    "word": "Gyata",
    "language_code": "tw"
  }
}

// Type 3: Correction
{
  "contribution_type": "correction",
  "existing_translation": "<translation-uuid>",
  "proposed_data": {
    "phonetic": { "old": "SIM-ba", "new": "SIM-bah" }
  }
}`}</pre>
              </div>
            </div>
          </div>

          <div id="vote" className="endpoint">
            <div className="endpoint-header">
              <span className="method method-post">POST</span>
              <span className="endpoint-path">/contributions/<span className="param">{"{id}"}</span>/vote/</span>
              <span className="endpoint-desc">Upvote or flag a pending contribution</span>
            </div>
            <div className="endpoint-body">
              <div className="code-block" style={{ borderTop: "0.5px solid var(--doc-border)", borderRadius: "8px", marginTop: 18 }}>
                <div className="code-bar">
                  <div className="code-dot" style={{ background: "#8B3A2A" }} />
                  <div className="code-dot" style={{ background: "#C8873A" }} />
                  <div className="code-dot" style={{ background: "#2D4A35" }} />
                  <span className="code-label">body</span>
                </div>
                <pre>{`{ "vote_type": "up" }   // or "flag"`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div id="categories" className="doc-section">
          <div className="doc-section-title">Categories</div>
          <p className="doc-section-sub">Use the category slug as a filter parameter on any concept endpoint.</p>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Slug</th><th>Label</th></tr>
              </thead>
              <tbody>
                {CATEGORIES.map((c) => (
                  <tr key={c.slug}><td><code>{c.slug}</code></td><td>{c.label}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rate limits */}
        <div id="rate-limits" className="doc-section">
          <div className="doc-section-title">Rate limits</div>
          <div className="callout callout-info">
            <strong>Public API —</strong> 100 requests per minute per IP. No API key required for read access. Authenticated users get higher limits.
          </div>
        </div>

        {/* Changelog */}
        <div id="changelog" className="doc-section">
          <div className="doc-section-title">Changelog</div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Version</th><th>Date</th><th>Notes</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>v1.0</code></td>
                  <td>2025</td>
                  <td>Initial release — concepts, translations, contributions, Kabila sync</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

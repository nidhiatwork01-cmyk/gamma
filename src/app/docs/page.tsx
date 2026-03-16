import Link from "next/link";

const architecture = [
  {
    title: "Portable Architecture",
    detail:
      "Presentation (App Router + components), domain/service layer (`src/lib`), and data access (`Prisma`) are separated so providers can be swapped independently. Switch databases without touching UI. Replace Groq with OpenAI by editing one file.",
  },
  {
    title: "UX Principles",
    detail:
      "Optimized for clarity, speed, and composability: high signal hierarchy (list → detail → full), low-friction forms, deterministic filtering, and mobile-responsive design. Users can capture and search knowledge in seconds.",
  },
  {
    title: "Agent Thinking",
    detail:
      "On ingestion, items are enriched by AI (summary + tags) or deterministic fallback if API unavailable. Query flow uses relevance ranking before synthesis for source-grounded answers. Keeps knowledge flow explicit and cacheable.",
  },
  {
    title: "Infrastructure Mindset",
    detail:
      "Capabilities exposed through public API route `GET /api/public/brain/query` suitable for widgets or external integrations. Stateless design runs on Vercel, Netlify, or AWS Lambda. Cold-start optimized with minimal dependencies.",
  },
];

const layerDetails = [
  {
    layer: "Presentation",
    location: "src/app/*, src/components/",
    responsibility: "React components, page routing, client-side state",
  },
  {
    layer: "API Interface",
    location: "src/app/api/",
    responsibility: "HTTP routes, request validation (Zod), response formatting",
  },
  {
    layer: "Service Layer",
    location: "src/lib/knowledge-service.ts",
    responsibility: "Business logic (CRUD, retrieval, ranking)",
  },
  {
    layer: "AI Adapter",
    location: "src/lib/ai.ts",
    responsibility: "LLM calls (Groq), summarization, tagging, synthesis",
  },
  {
    layer: "Validation",
    location: "src/lib/knowledge-schema.ts",
    responsibility: "Input/output schema validation (Zod)",
  },
  {
    layer: "Data Access",
    location: "prisma/",
    responsibility: "Database schema, migrations, ORM queries",
  },
];

const apiRoutes = [
  { method: "GET", path: "/api/knowledge", params: "q, type, tag, sort", desc: "List knowledge items" },
  { method: "POST", path: "/api/knowledge", params: "title, content, type", desc: "Create item + enrich with AI" },
  { method: "GET", path: "/api/knowledge/:id", params: "—", desc: "Get single item" },
  {
    method: "GET",
    path: "/api/public/brain/query",
    params: "question",
    desc: "Query endpoint (public API)",
  },
];

const techDecisions = [
  { tech: "Next.js 16", why: "Full-stack JS, API routes, optimized builds, serverless-ready" },
  { tech: "React 19", why: "Modern hooks, better performance, concurrent features" },
  { tech: "Prisma", why: "Type-safe DB access, automatic migrations, relation querying" },
  { tech: "PostgreSQL", why: "Reliable, JSONB for array fields, full-text search support" },
  { tech: "Zod", why: "Runtime validation on boundaries, type inference, clear errors" },
  { tech: "Groq", why: "Fast inference, free tier, OpenAI-compatible API" },
  { tech: "Tailwind v4", why: "Utility-first, responsive, no CSS compilation overhead" },
];

export default function DocsPage() {
  return (
    <div className="pb-16">
      <header className="border-b border-[#c9cedd] bg-[rgba(235,237,242,0.82)] backdrop-blur">
        <div className="page-shell flex min-h-16 items-center justify-between py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[#5b6074]">System Documentation</p>
          <Link href="/" className="text-sm font-semibold text-[#363b4f] hover:underline">
            Back to app
          </Link>
        </div>
      </header>

      <main className="page-shell mt-8 space-y-5">
        <article className="surface-card p-6 sm:p-7">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Second Brain: Architecture & Design</h1>
          <p className="muted mt-3 max-w-4xl leading-7">
            Comprehensive documentation on system architecture, design principles, and infrastructure. Built for
            portability, performance, and maintainability.
          </p>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">Quick Facts</h2>
          <ul className="mt-4 space-y-2 text-[#34394b]">
            <li>
              <strong>Tech Stack:</strong> Next.js 16 + React 19 + Prisma + PostgreSQL + Groq
            </li>
            <li>
              <strong>Database:</strong> PostgreSQL with Prisma ORM (supports Neon, Supabase, local)
            </li>
            <li>
              <strong>AI Model:</strong> Groq LLama 3.1 8B (fast, free tier available)
            </li>
            <li>
              <strong>Deployment:</strong> Vercel, Netlify, or any Node.js host
            </li>
            <li>
              <strong>Status:</strong> Production-ready, includes error handling and fallbacks
            </li>
          </ul>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">Design Principles</h2>
          <div className="mt-4 grid gap-3">
            {architecture.map((item) => (
              <section key={item.title} className="rounded-xl border border-[#c8ccda] bg-[#eef0f7] p-4">
                <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="muted mt-2 text-sm">{item.detail}</p>
              </section>
            ))}
          </div>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">Layered Architecture</h2>
          <p className="muted mt-2">
            Clear separation of concerns enables swappable providers and independent testing:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#c8ccda] bg-[#f5f6fa]">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Layer</th>
                  <th className="px-4 py-2 text-left font-semibold">Location</th>
                  <th className="px-4 py-2 text-left font-semibold">Responsibility</th>
                </tr>
              </thead>
              <tbody>
                {layerDetails.map((row) => (
                  <tr key={row.layer} className="border-b border-[#e5e8f0] hover:bg-[#f9fafb]">
                    <td className="px-4 py-3 font-semibold text-[#363b4f]">{row.layer}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#5b6074]">{row.location}</td>
                    <td className="px-4 py-3 text-[#5b6074]">{row.responsibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">Data Flow</h2>
          <div className="mt-4 space-y-3 font-mono text-sm">
            <div className="rounded border border-[#c8ccda] bg-[#f5f6fa] p-3">
              <p className="font-semibold text-[#363b4f]">1. Capture</p>
              <p className="muted text-xs">User submits form → POST /api/knowledge → validation (Zod)</p>
            </div>
            <div className="rounded border border-[#c8ccda] bg-[#f5f6fa] p-3">
              <p className="font-semibold text-[#363b4f]">2. Enrich</p>
              <p className="muted text-xs">knowledge-service calls ai.ts → Groq API → summary + tags (or fallback)</p>
            </div>
            <div className="rounded border border-[#c8ccda] bg-[#f5f6fa] p-3">
              <p className="font-semibold text-[#363b4f]">3. Store</p>
              <p className="muted text-xs">Prisma ORM → PostgreSQL (create record + tags)</p>
            </div>
            <div className="rounded border border-[#c8ccda] bg-[#f5f6fa] p-3">
              <p className="font-semibold text-[#363b4f]">4. Query</p>
              <p className="muted text-xs">GET /api/knowledge?q=... → filter/sort → return to UI</p>
            </div>
            <div className="rounded border border-[#c8ccda] bg-[#f5f6fa] p-3">
              <p className="font-semibold text-[#363b4f]">5. Synthesize</p>
              <p className="muted text-xs">GET /api/public/brain/query → rank sources → LLM synthesis → public response</p>
            </div>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">API Endpoints</h2>
          <p className="muted mt-2 mb-4">All routes are type-safe and return validated responses:</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#c8ccda] bg-[#f5f6fa]">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Method</th>
                  <th className="px-4 py-2 text-left font-semibold">Path</th>
                  <th className="px-4 py-2 text-left font-semibold">Query/Body</th>
                  <th className="px-4 py-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {apiRoutes.map((route) => (
                  <tr key={route.path} className="border-b border-[#e5e8f0] hover:bg-[#f9fafb]">
                    <td className="px-4 py-3 font-mono font-semibold text-[#007acc]">{route.method}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#363b4f]">{route.path}</td>
                    <td className="px-4 py-3 text-xs text-[#5b6074]">{route.params}</td>
                    <td className="px-4 py-3 text-[#5b6074]">{route.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">Technology Rationale</h2>
          <p className="muted mt-2 mb-4">Why these tools were chosen:</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {techDecisions.map((item) => (
              <div key={item.tech} className="rounded border border-[#c8ccda] p-3">
                <h4 className="font-semibold text-[#363b4f]">{item.tech}</h4>
                <p className="muted text-xs mt-1">{item.why}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">Swappable Components</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded border border-[#c8ccda] bg-[#f5f6fa] p-4">
              <h4 className="font-semibold text-[#363b4f]">Change Database Provider</h4>
              <p className="muted text-sm mt-1">
                Edit `prisma/schema.prisma` datasource, update `.env` connection URL, run `npm run db:push`. UI and
                API remain unchanged.
              </p>
            </div>
            <div className="rounded border border-[#c8ccda] bg-[#f5f6fa] p-4">
              <h4 className="font-semibold text-[#363b4f]">Change AI Provider</h4>
              <p className="muted text-sm mt-1">
                Replace Groq calls in `src/lib/ai.ts`. Update `.env` credentials. Service layer interface stays the
                same.
              </p>
            </div>
            <div className="rounded border border-[#c8ccda] bg-[#f5f6fa] p-4">
              <h4 className="font-semibold text-[#363b4f]">Change UI Framework</h4>
              <p className="muted text-sm mt-1">
                Rebuild `src/app/*` and `src/components/*` in Vue/Svelte/etc. API and service layer are language-agnostic.
              </p>
            </div>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">Deployment Checklist</h2>
          <ul className="mt-4 space-y-2 text-[#34394b]">
            <li>✓ Database provisioned (Neon, Supabase, or self-hosted PostgreSQL)</li>
            <li>✓ Schema pushed: `npm run db:push`</li>
            <li>✓ `.env` variables set locally and in production</li>
            <li>✓ Groq API key obtained (or app works without it with fallback)</li>
            <li>✓ Code pushed to GitHub</li>
            <li>✓ Vercel/Netlify connected and environment variables set</li>
            <li>✓ Build succeeds and app loads at production URL</li>
          </ul>
        </article>

        <article className="surface-card p-6 sm:p-7 bg-[#f5f6fa]">
          <h2 className="text-2xl font-semibold tracking-tight">Questions?</h2>
          <p className="muted mt-3">
            See the <Link href="/" className="font-semibold text-[#363b4f] hover:underline">
              dashboard
            </Link>{" "}
            for a live demo, or check GitHub repo for source code.
          </p>
        </article>
      </main>
    </div>
  );
}

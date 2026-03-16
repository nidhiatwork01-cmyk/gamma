import Link from "next/link";

const architecture = [
  {
    title: "Portable Architecture",
    detail:
      "Presentation (App Router + components), domain/service layer (`src/lib`), and data access (`Prisma`) are separated so providers can be swapped independently.",
  },
  {
    title: "Principles-Based UX",
    detail:
      "UI is optimized for clarity, speed, and composability: high signal hierarchy, low-friction forms, and deterministic controls for filtering and retrieval.",
  },
  {
    title: "Agent Thinking",
    detail:
      "On ingestion, each item is enriched by AI (summary + tags) or deterministic fallback. Query flow uses retrieval ranking before synthesis for source-grounded answers.",
  },
  {
    title: "Infrastructure Mindset",
    detail:
      "Capabilities are exposed through public API route `GET /api/public/brain/query` suitable for widgets or external integrations.",
  },
];

const apiRoutes = [
  "GET /api/knowledge?q=&type=&tag=&sort=",
  "POST /api/knowledge",
  "GET /api/knowledge/:id",
  "GET /api/public/brain/query?question=",
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
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Second Brain Architecture Notes</h1>
          <p className="muted mt-3 max-w-4xl leading-7">
            This document explains how the app satisfies the assignment requirements across full-stack delivery, AI
            integration, and maintainable architecture.
          </p>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">Tech Stack</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[#34394b]">
            <li>Frontend: Next.js App Router + React 19 + Tailwind CSS v4</li>
            <li>Backend: Next.js route handlers under `src/app/api/*`</li>
            <li>Database: PostgreSQL + Prisma ORM</li>
            <li>AI: Server-side call to Groq chat completions endpoint, with fallback mode</li>
          </ul>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">Architecture Principles</h2>
          <div className="mt-4 grid gap-3">
            {architecture.map((item) => (
              <section key={item.title} className="rounded-xl border border-[#c8ccda] bg-[#eef0f7] p-4">
                <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
                <p className="muted mt-2">{item.detail}</p>
              </section>
            ))}
          </div>
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-3xl font-semibold tracking-tight">Public Interface</h2>
          <p className="muted mt-2">Supported API routes:</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[#34394b]">
            {apiRoutes.map((route) => (
              <li key={route}>
                <code className="rounded border border-[#bec3d4] bg-[#eceef6] px-2 py-1 text-[0.88rem]">{route}</code>
              </li>
            ))}
          </ul>
        </article>
      </main>
    </div>
  );
}

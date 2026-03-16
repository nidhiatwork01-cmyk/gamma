import Link from "next/link";
import { DashboardFilters } from "@/components/dashboard-filters";
import { KnowledgeForm } from "@/components/knowledge-form";
import { KnowledgeList } from "@/components/knowledge-list";
import { PublicQueryWidget } from "@/components/public-query-widget";
import { StatsCard } from "@/components/stats-card";
import { listKnowledgeSchema } from "@/lib/knowledge-schema";
import { getKnowledgeItems } from "@/lib/knowledge-service";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const asString = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const collectTags = (items: Array<{ tags: string[] }>) =>
  [...new Set(items.flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b));

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const filters = {
    q: asString(params.q),
    type: asString(params.type),
    tag: asString(params.tag),
    sort: asString(params.sort),
  };
  const parsedFilters = listKnowledgeSchema.safeParse(filters);
  const query = parsedFilters.success ? parsedFilters.data : { sort: "newest" as const };

  let itemsResult: Awaited<ReturnType<typeof getKnowledgeItems>> = { items: [], total: 0 };
  let loadError: string | null = null;

  try {
    itemsResult = await getKnowledgeItems(query);
  } catch (error) {
    loadError = `Could not load knowledge items. Verify DATABASE_URL and run prisma migration. ${
      error instanceof Error ? error.message : ""
    }`.trim();
  }

  const tags = collectTags(itemsResult.items);

  return (
    <div className="pb-14">
      <header className="border-b border-[#c9cedd] bg-[rgba(235,237,242,0.82)] backdrop-blur">
        <div className="page-shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[#5b6074]">Full-Stack AI Assignment</p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">Second Brain App</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm text-[#41465a]">
            <Link href="/" className="font-semibold hover:underline">
              Dashboard
            </Link>
            <Link href="/docs" className="font-semibold hover:underline">
              Docs
            </Link>
            <a href="/api/public/brain/query?question=What%20is%20in%20this%20knowledge%20base" className="font-semibold hover:underline">
              Public API
            </a>
          </nav>
        </div>
      </header>

      <main className="page-shell mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.25fr]">
        <section className="space-y-5">
          <KnowledgeForm />
          <PublicQueryWidget />
        </section>

        <section className="space-y-5">
          <article className="surface-card p-5 sm:p-6">
            <p className="pill">Smart Dashboard</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Search, Filter, Analyze</h2>
            <p className="muted mt-2 max-w-3xl leading-7">
              Browse every knowledge item with fast filtering by type and tags. Each entry includes AI-generated summary
              and auto-tags, with a dedicated detail page for deep review.
            </p>
          </article>

          <StatsCard items={itemsResult.items} total={itemsResult.total} />

          <DashboardFilters items={itemsResult.items} total={itemsResult.total} query={query} tags={tags} />

          {loadError ? (
            <article className="rounded-xl border border-[#d0a2af] bg-[#fce7ed] p-4 text-sm text-[#7b2d42]">{loadError}</article>
          ) : null}

          <KnowledgeList items={itemsResult.items} />
        </section>
      </main>
    </div>
  );
}

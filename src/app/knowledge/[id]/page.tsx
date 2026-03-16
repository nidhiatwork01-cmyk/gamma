import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { typeLabel } from "@/lib/knowledge-constants";

export const dynamic = "force-dynamic";

type DetailProps = {
  params: Promise<{ id: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function KnowledgeDetailPage({ params }: DetailProps) {
  const { id } = await params;

  let item: Awaited<ReturnType<typeof prisma.knowledgeItem.findUnique>> = null;
  try {
    item = await prisma.knowledgeItem.findUnique({
      where: { id },
    });
  } catch (error) {
    throw new Error(`Database error while loading item: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  if (!item) {
    notFound();
  }

  return (
    <div className="pb-16">
      <header className="border-b border-[#c9cedd] bg-[rgba(235,237,242,0.82)] backdrop-blur">
        <div className="page-shell flex min-h-16 items-center justify-between py-3">
          <Link href="/" className="text-sm font-semibold text-[#363b4f] hover:underline">
            ← Back to Dashboard
          </Link>
          <Link href="/docs" className="text-sm font-semibold text-[#363b4f] hover:underline">
            Documentation
          </Link>
        </div>
      </header>

      <main className="page-shell mt-8 space-y-5">
        <article className="surface-card p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill">{typeLabel[item.type]}</span>
            <span className="text-xs text-[#6d7287]">Created {dateFormatter.format(item.createdAt)}</span>
            <span className="text-xs text-[#6d7287]">Updated {dateFormatter.format(item.updatedAt)}</span>
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{item.title}</h1>
          <p className="muted mt-4 leading-7">{item.summary || "No AI summary available for this item."}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
          {item.sourceUrl ? (
            <p className="mt-4 text-sm">
              Source:{" "}
              <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#2f3550] underline">
                {item.sourceUrl}
              </a>
            </p>
          ) : null}
        </article>

        <article className="surface-card p-6 sm:p-7">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Full Content</h2>
          <div className="soft-separator mt-4 pt-4">
            <p className="whitespace-pre-wrap leading-8 text-[#33384b]">{item.content}</p>
          </div>
        </article>
      </main>
    </div>
  );
}

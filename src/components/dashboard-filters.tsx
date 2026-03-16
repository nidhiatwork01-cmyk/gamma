import Link from "next/link";
import type { KnowledgeItem } from "@prisma/client";
import { KNOWLEDGE_TYPES, typeLabel } from "@/lib/knowledge-constants";
import { ExportButton } from "@/components/export-button";

type FiltersProps = {
  items: KnowledgeItem[];
  total: number;
  query: {
    q?: string;
    type?: string;
    tag?: string;
    sort?: string;
  };
  tags: string[];
};

/**
 * DashboardFilters: Search and filter form for knowledge items
 * Features: Full-text search, type filtering, tag filtering, sorting
 * Also displays filtered results count and export button
 */
export function DashboardFilters({ items, total, query, tags }: FiltersProps) {
  return (
    <form method="GET" className="surface-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <label className="block flex-[1.5]">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.06em] text-[#5d6276]">Search</span>
          <input className="field" name="q" defaultValue={query.q ?? ""} placeholder="Find notes by title, summary, tags..." />
        </label>

        <label className="block flex-1">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.06em] text-[#5d6276]">Type</span>
          <select className="field" name="type" defaultValue={query.type ?? ""}>
            <option value="">All types</option>
            {KNOWLEDGE_TYPES.map((type) => (
              <option key={type} value={type}>
                {typeLabel[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="block flex-1">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.06em] text-[#5d6276]">Tag</span>
          <select className="field" name="tag" defaultValue={query.tag ?? ""}>
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label className="block flex-1">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.06em] text-[#5d6276]">Sort</span>
          <select className="field" name="sort" defaultValue={query.sort ?? "newest"}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="btn-primary">
            Apply
          </button>
          <Link className="btn-subtle inline-flex items-center justify-center px-4 no-underline" href="/">
            Reset
          </Link>
          <ExportButton items={items} />
        </div>
      </div>

      <p className="muted mt-3 text-sm">
        Showing <strong className="text-[#2a2e40]">{items.length}</strong> of <strong className="text-[#2a2e40]">{total}</strong> items.
      </p>
    </form>
  );
}

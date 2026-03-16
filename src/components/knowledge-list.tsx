import Link from "next/link";
import type { KnowledgeItem } from "@prisma/client";
import { typeLabel } from "@/lib/knowledge-constants";

type KnowledgeListProps = {
  items: KnowledgeItem[];
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

/**
 * Type-to-color mapping for visual categorization
 * NOTE: Amber, LINK: Cyan, INSIGHT: Purple gradients
 */
const typeColors: Record<string, string> = {
  NOTE: "from-amber-500 to-amber-600",
  LINK: "from-cyan-500 to-cyan-600",
  INSIGHT: "from-purple-500 to-purple-600",
};

/**
 * KnowledgeList: Displays paginated knowledge items with rich UI
 * Features: Type badges with color coding, formatted dates, AI summaries, tags
 * Hover interactions on cards and links for better feedback
 */

export function KnowledgeList({ items }: KnowledgeListProps) {
  if (items.length === 0) {
    return (
      <article className="surface-card p-8 text-center">
        <h3 className="text-2xl font-semibold tracking-tight">No knowledge items yet</h3>
        <p className="muted mt-2">
          Create your first note from the capture form. Once data exists, search/filter and AI query become active.
        </p>
      </article>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="surface-card p-4 sm:p-5 group/item">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`pill bg-gradient-to-r ${typeColors[item.type] || "from-gray-500 to-gray-600"} !text-white !border-0`}>
                {typeLabel[item.type]}
              </span>
              <span className="text-xs text-[#6a6f84] font-medium">{dateFormatter.format(new Date(item.createdAt))}</span>
            </div>
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold tracking-tight group-hover/item:text-blue-600 transition-colors duration-200">{item.title}</h3>
              <p className="muted mt-2 leading-7 line-clamp-2">{item.summary || item.content.slice(0, 260)}</p>
            </div>
            <Link
              href={`/knowledge/${item.id}`}
              className="whitespace-nowrap px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:from-blue-700 hover:to-blue-800 hover:scale-105"
            >
              View →
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

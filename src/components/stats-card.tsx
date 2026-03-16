import type { KnowledgeItem } from "@prisma/client";

type StatsCardProps = {
  items: KnowledgeItem[];
  total: number;
};

// Configuration for each stat card with emoji icon and Tailwind gradient class
const statConfigs = [
  { label: "Total Items", icon: "📚", gradient: "from-blue-600 to-blue-700" },
  { label: "Unique Tags", icon: "🏷️", gradient: "from-slate-600 to-slate-700" },
  { label: "Types", icon: "✨", gradient: "from-indigo-600 to-indigo-700" },
];

/**
 * StatsCard: Dashboard overview component
 * Displays key metrics (total items, unique tags, type count) with visual cards
 * Uses Tailwind gradients for visual appeal and hover animations for interactivity
 */
export function StatsCard({ items, total }: StatsCardProps) {
  // Calculate unique tags from all items
  const uniqueTags = [...new Set(items.flatMap((item) => item.tags))].length;
  
  // Count items by type (NOTE, LINK, INSIGHT)
  const typeCounts = items.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const stats = [
    { label: "Total Items", value: total.toString(), config: statConfigs[0] },
    { label: "Unique Tags", value: uniqueTags.toString(), config: statConfigs[1] },
    { label: "Types", value: Object.keys(typeCounts).length.toString(), config: statConfigs[2] },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-gradient-to-br ${stat.config.gradient} rounded-[16px] border border-white/20 p-4 sm:p-5 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-white/40`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-white/80">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold tabular-nums">{stat.value}</p>
            </div>
            <span className="text-2xl">{stat.config.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

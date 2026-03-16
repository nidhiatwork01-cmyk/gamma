export const KNOWLEDGE_TYPES = ["NOTE", "LINK", "INSIGHT"] as const;

export const typeLabel: Record<(typeof KNOWLEDGE_TYPES)[number], string> = {
  NOTE: "Note",
  LINK: "Link",
  INSIGHT: "Insight",
};

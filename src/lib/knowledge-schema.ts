import { z } from "zod";

const knowledgeTypeSchema = z.enum(["NOTE", "LINK", "INSIGHT"]);

const cleanTag = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "-");

export const createKnowledgeSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(140, "Title is too long"),
  content: z.string().trim().min(10, "Content is required").max(20_000, "Content is too long"),
  type: knowledgeTypeSchema,
  sourceUrl: z
    .string()
    .trim()
    .url("Source URL must be a valid URL")
    .max(1024, "Source URL is too long")
    .optional()
    .or(z.literal("")),
  tagsInput: z.string().trim().max(500, "Tags are too long").optional().default(""),
});

export const listKnowledgeSchema = z.object({
  q: z.string().trim().max(200).optional(),
  type: knowledgeTypeSchema.optional(),
  tag: z.string().trim().max(80).optional(),
  sort: z.enum(["newest", "oldest"]).optional().default("newest"),
});

export const publicQuerySchema = z.object({
  question: z.string().trim().min(5, "Question is too short").max(600, "Question is too long"),
});

export const parseTagsInput = (raw: string) => {
  if (!raw.trim()) {
    return [];
  }

  const uniq = new Set(
    raw
      .split(",")
      .map(cleanTag)
      .filter((tag) => tag.length > 0)
      .slice(0, 12)
  );

  return [...uniq];
};

export type CreateKnowledgeInput = z.infer<typeof createKnowledgeSchema>;
export type KnowledgeListInput = z.infer<typeof listKnowledgeSchema>;

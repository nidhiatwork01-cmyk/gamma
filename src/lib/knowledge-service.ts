import { Prisma, type KnowledgeItem } from "@prisma/client";
import { generateEnhancements, generateQueryAnswer } from "@/lib/ai";
import { listKnowledgeSchema, parseTagsInput, type CreateKnowledgeInput, type KnowledgeListInput } from "@/lib/knowledge-schema";
import { prisma } from "@/lib/prisma";

export type KnowledgeListResult = {
  items: KnowledgeItem[];
  total: number;
};

const buildSearchWhere = ({ q, type, tag }: KnowledgeListInput): Prisma.KnowledgeItemWhereInput => {
  const where: Prisma.KnowledgeItemWhereInput = {};

  if (type) {
    where.type = type;
  }

  if (tag) {
    where.tags = { has: tag.toLowerCase() };
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
      { summary: { contains: q, mode: "insensitive" } },
      { tags: { has: q.toLowerCase() } },
    ];
  }

  return where;
};

export const getKnowledgeItems = async (input: Partial<KnowledgeListInput>) => {
  const parsed = listKnowledgeSchema.safeParse(input);
  const query = parsed.success ? parsed.data : { sort: "newest" as const };
  const where = buildSearchWhere(query);
  const orderBy = query.sort === "oldest" ? { createdAt: "asc" as const } : { createdAt: "desc" as const };

  const [items, total] = await prisma.$transaction([
    prisma.knowledgeItem.findMany({
      where,
      orderBy,
      take: 100,
    }),
    prisma.knowledgeItem.count({ where }),
  ]);

  return { items, total } satisfies KnowledgeListResult;
};

export const createKnowledgeItem = async (input: CreateKnowledgeInput) => {
  const tags = parseTagsInput(input.tagsInput);
  const enhancements = await generateEnhancements({
    title: input.title,
    content: input.content,
    type: input.type,
    tags,
  });

  const mergedTags = [...new Set([...tags, ...enhancements.tags])].slice(0, 12);

  return prisma.knowledgeItem.create({
    data: {
      title: input.title,
      content: input.content,
      type: input.type,
      sourceUrl: input.sourceUrl || null,
      tags: mergedTags,
      summary: enhancements.summary,
    },
  });
};

const tokenSet = (value: string) =>
  new Set(
    value
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2)
  );

const scoreItem = (questionTokens: Set<string>, item: Pick<KnowledgeItem, "title" | "content" | "summary" | "tags">) => {
  const haystack = `${item.title} ${item.summary ?? ""} ${item.tags.join(" ")} ${item.content.slice(0, 800)}`;
  const haystackTokens = tokenSet(haystack);

  let score = 0;
  questionTokens.forEach((token) => {
    if (haystackTokens.has(token)) {
      score += 1;
    }
  });

  return score;
};

export const answerPublicQuestion = async (question: string) => {
  const candidates = await prisma.knowledgeItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
    select: {
      id: true,
      title: true,
      summary: true,
      content: true,
      type: true,
      tags: true,
      createdAt: true,
    },
  });

  const questionTokens = tokenSet(question);
  const ranked = candidates
    .map((item) => ({ item, score: scoreItem(questionTokens, item) }))
    .sort((a, b) => b.score - a.score || b.item.createdAt.getTime() - a.item.createdAt.getTime())
    .slice(0, 6)
    .map(({ item }) => item);

  const ai = await generateQueryAnswer({
    question,
    contextItems: ranked,
  });

  const usedIds = new Set(ai.citedIds);
  const sources = ranked
    .filter((item) => usedIds.size === 0 || usedIds.has(item.id))
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      tags: item.tags,
      createdAt: item.createdAt,
    }));

  return {
    answer: ai.answer,
    sources,
  };
};

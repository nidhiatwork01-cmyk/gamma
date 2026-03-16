import type { KnowledgeItem, KnowledgeType } from "@prisma/client";

type Enhancements = {
  summary: string;
  tags: string[];
};

type QueryAnswer = {
  answer: string;
  citedIds: string[];
};

const groqModel = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
const groqBaseUrl = process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1";

const compact = (value: string) => value.trim().replace(/\s+/g, " ");

const fallbackSummary = (content: string) => {
  const normalized = compact(content);
  if (normalized.length <= 220) {
    return normalized;
  }

  const cutoff = normalized.slice(0, 220);
  const lastStop = Math.max(cutoff.lastIndexOf("."), cutoff.lastIndexOf("!"), cutoff.lastIndexOf("?"));
  return (lastStop > 120 ? cutoff.slice(0, lastStop + 1) : cutoff).trim();
};

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3);

const fallbackTags = (title: string, content: string, type: KnowledgeType, seedTags: string[]) => {
  const tokens = [...tokenize(title), ...tokenize(content)];
  const counts = new Map<string, number>();

  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  const weighted = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([token]) => token)
    .slice(0, 6);

  const result = new Set<string>([type.toLowerCase(), ...seedTags.map((tag) => tag.toLowerCase()), ...weighted]);
  return [...result].slice(0, 8);
};

const extractJsonFromText = (raw: string) => {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return raw.slice(start, end + 1).trim();
  }

  return raw.trim();
};

const parseJsonObject = <T>(raw: string, fallback: T) => {
  const candidate = extractJsonFromText(raw);
  try {
    const parsed = JSON.parse(candidate);
    return parsed as T;
  } catch {
    return fallback;
  }
};

const normalizeMessageContent = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .join(" ");
  }

  return null;
};

const createChatCompletion = async (messages: Array<{ role: "system" | "user"; content: string }>) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch(`${groqBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: groqModel,
      temperature: 0.2,
      max_tokens: 700,
      messages,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${errorText.slice(0, 240)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: unknown;
      };
    }>;
  };

  const content = normalizeMessageContent(payload.choices?.[0]?.message?.content);
  return content ?? null;
};

export const generateEnhancements = async (input: {
  title: string;
  content: string;
  type: KnowledgeType;
  tags: string[];
}): Promise<Enhancements> => {
  const fallback: Enhancements = {
    summary: fallbackSummary(input.content),
    tags: fallbackTags(input.title, input.content, input.type, input.tags),
  };

  if (!process.env.GROQ_API_KEY) {
    return fallback;
  }

  try {
    const content = await createChatCompletion([
      {
        role: "system",
        content:
          "Return JSON only with keys: summary (string, <=240 chars) and tags (array of 3-8 lowercase kebab-case tags).",
      },
      {
        role: "user",
        content: JSON.stringify({
          title: input.title,
          content: input.content.slice(0, 5000),
          type: input.type,
          existingTags: input.tags,
        }),
      },
    ]);

    if (!content) {
      return fallback;
    }

    const parsed = parseJsonObject<{ summary?: string; tags?: string[] }>(content, {});
    const summary = parsed.summary ? compact(parsed.summary).slice(0, 240) : fallback.summary;
    const tags = Array.isArray(parsed.tags)
      ? parsed.tags
          .map((tag) => compact(tag).toLowerCase().replace(/\s+/g, "-"))
          .filter(Boolean)
          .slice(0, 8)
      : fallback.tags;

    return { summary, tags: tags.length ? tags : fallback.tags };
  } catch {
    return fallback;
  }
};

const fallbackAnswer = (question: string, items: Pick<KnowledgeItem, "id" | "title" | "summary" | "content" | "type" | "tags">[]) => {
  const preview = items
    .slice(0, 3)
    .map((item, index) => `${index + 1}. ${item.title}: ${(item.summary || fallbackSummary(item.content)).slice(0, 180)}`)
    .join("\n");

  return {
    answer:
      preview.length > 0
        ? `Based on your notes, here is the best answer to "${question}":\n${preview}`
        : "I could not find any matching notes yet. Add more knowledge items and try again.",
    citedIds: items.slice(0, 3).map((item) => item.id),
  };
};

export const generateQueryAnswer = async (input: {
  question: string;
  contextItems: Pick<KnowledgeItem, "id" | "title" | "summary" | "content" | "type" | "tags">[];
}): Promise<QueryAnswer> => {
  const fallback = fallbackAnswer(input.question, input.contextItems);
  if (!process.env.GROQ_API_KEY || input.contextItems.length === 0) {
    return fallback;
  }

  const context = input.contextItems
    .map(
      (item, index) =>
        `Source ${index + 1} | id=${item.id}\nTitle: ${item.title}\nType: ${item.type}\nTags: ${item.tags.join(", ")}\nSummary: ${
          item.summary ?? fallbackSummary(item.content)
        }\nContent: ${item.content.slice(0, 1200)}`
    )
    .join("\n\n");

  try {
    const content = await createChatCompletion([
      {
        role: "system",
        content:
          "Answer using only provided sources. Return JSON with keys: answer (string) and citedIds (array of source ids used). Keep answer under 180 words.",
      },
      {
        role: "user",
        content: `Question: ${input.question}\n\nSources:\n${context}`,
      },
    ]);

    if (!content) {
      return fallback;
    }

    const parsed = parseJsonObject<{ answer?: string; citedIds?: string[] }>(content, {});
    const citedIds = Array.isArray(parsed.citedIds) ? parsed.citedIds.filter(Boolean).slice(0, 5) : fallback.citedIds;
    const answer = parsed.answer ? compact(parsed.answer).slice(0, 1200) : fallback.answer;

    return { answer, citedIds: citedIds.length ? citedIds : fallback.citedIds };
  } catch {
    return fallback;
  }
};

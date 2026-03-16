import { NextResponse } from "next/server";
import { createKnowledgeItem, getKnowledgeItems } from "@/lib/knowledge-service";
import { createKnowledgeSchema, listKnowledgeSchema } from "@/lib/knowledge-schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = listKnowledgeSchema.safeParse({
      q: searchParams.get("q") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      tag: searchParams.get("tag") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await getKnowledgeItems(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/knowledge failed", error);
    return NextResponse.json(
      {
        error: "Failed to fetch knowledge items. Check database connectivity.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createKnowledgeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const item = await createKnowledgeItem(parsed.data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/knowledge failed", error);
    return NextResponse.json(
      {
        error: "Failed to create knowledge item. Check database and API settings.",
      },
      { status: 500 }
    );
  }
}

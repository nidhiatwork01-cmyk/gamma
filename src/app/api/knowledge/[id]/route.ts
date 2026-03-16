import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const item = await prisma.knowledgeItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        {
          error: "Knowledge item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("GET /api/knowledge/[id] failed", error);
    return NextResponse.json(
      {
        error: "Failed to fetch knowledge item.",
      },
      { status: 500 }
    );
  }
}

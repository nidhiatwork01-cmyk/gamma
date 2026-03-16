import { NextResponse } from "next/server";
import { answerPublicQuestion } from "@/lib/knowledge-service";
import { publicQuerySchema } from "@/lib/knowledge-schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = publicQuerySchema.safeParse({
      question: searchParams.get("question") ?? "",
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid question",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await answerPublicQuestion(parsed.data.question);
    return NextResponse.json({
      question: parsed.data.question,
      ...result,
    });
  } catch (error) {
    console.error("GET /api/public/brain/query failed", error);
    return NextResponse.json(
      {
        error: "Failed to answer query. Check database and AI configuration.",
      },
      { status: 500 }
    );
  }
}

"use client";

import { startTransition, useDeferredValue, useState } from "react";

type QuerySource = {
  id: string;
  title: string;
  type: string;
  tags: string[];
  createdAt: string;
};

type QueryResponse = {
  question: string;
  answer: string;
  sources: QuerySource[];
  error?: string;
};

const starterPrompts = [
  "What are the main product risks from my notes?",
  "Summarize what we know about onboarding friction.",
  "Which notes discuss architecture tradeoffs?",
];

export function PublicQueryWidget() {
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const deferredQuestion = useDeferredValue(question);

  const runQuery = async (nextQuestion: string) => {
    const trimmed = nextQuestion.trim();
    if (!trimmed) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch(`/api/public/brain/query?question=${encodeURIComponent(trimmed)}`);
      const payload = (await response.json()) as QueryResponse;

      if (!response.ok) {
        setError(payload.error ?? "Query failed");
        setResult(null);
        return;
      }

      setResult(payload);
    } catch {
      setError("Unable to query the public endpoint.");
      setResult(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="surface-dark fade-in p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Public Query Endpoint</h2>
        <code className="rounded-md border border-[#6f7694] bg-[#111425] px-2 py-1 text-xs">GET /api/public/brain/query</code>
      </div>
      <p className="mt-2 text-sm text-[#c8cee3] sm:text-[0.95rem]">
        Ask natural-language questions over your stored knowledge. This uses retrieval + AI answer synthesis.
      </p>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(() => {
            void runQuery(question);
          });
        }}
      >
        <input
          className="field !border-[#5e6484] !bg-[#1f2438] !text-[#ecf0ff] placeholder:!text-[#9ca2be]"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question about your notes..."
        />
        <button type="submit" className="btn-primary shrink-0" disabled={busy}>
          {busy ? "Thinking..." : "Query Brain"}
        </button>
      </form>

      {deferredQuestion.trim().length === 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              className="rounded-full border border-[#5d6483] px-3 py-1.5 text-left text-xs text-[#dce2fa] transition hover:border-[#adb4ce]"
              onClick={() => {
                setQuestion(prompt);
                startTransition(() => {
                  void runQuery(prompt);
                });
              }}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm font-medium text-[#ffbdca]">{error}</p> : null}

      {result ? (
        <div className="mt-4 rounded-xl border border-[#61698a] bg-[#20263a] p-4">
          <p className="text-sm text-[#c4cbdf]">{result.question}</p>
          <p className="mt-2 leading-7 text-[#eef1ff]">{result.answer}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.sources.map((source) => (
              <span key={source.id} className="rounded-full border border-[#7d84a1] px-2.5 py-1 text-xs text-[#dbe0f7]">
                {source.title}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

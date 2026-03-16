"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { KNOWLEDGE_TYPES, typeLabel } from "@/lib/knowledge-constants";

type FormState = {
  title: string;
  content: string;
  type: (typeof KNOWLEDGE_TYPES)[number];
  sourceUrl: string;
  tagsInput: string;
};

const initialState: FormState = {
  title: "",
  content: "",
  type: "NOTE",
  sourceUrl: "",
  tagsInput: "",
};

export function KnowledgeForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>(initialState);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Could not create item");
        return;
      }

      setState(initialState);
      setFeedback("Knowledge item created. AI summary/tags generated successfully.");

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Request failed. Check API/database configuration.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="surface-card fade-in p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Capture Knowledge</h2>
        <span className="pill">Task 1</span>
      </div>
      <p className="muted mt-2 text-sm sm:text-[0.95rem]">
        Add a note, insight, or reference link. Summaries and additional tags are generated server-side.
      </p>

      <div className="mt-5 space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[#2a2e40]">Title</span>
          <input
            required
            className="field"
            value={state.title}
            onChange={(event) => setField("title", event.target.value)}
            placeholder="What is this knowledge about?"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[#2a2e40]">Content</span>
          <textarea
            required
            rows={6}
            className="field resize-y"
            value={state.content}
            onChange={(event) => setField("content", event.target.value)}
            placeholder="Paste notes, write your insight, or summarize a source."
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#2a2e40]">Type</span>
            <select
              className="field"
              value={state.type}
              onChange={(event) => setField("type", event.target.value as FormState["type"])}
            >
              {KNOWLEDGE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {typeLabel[type]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#2a2e40]">Source URL</span>
            <input
              className="field"
              value={state.sourceUrl}
              onChange={(event) => setField("sourceUrl", event.target.value)}
              placeholder="https://..."
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[#2a2e40]">Tags</span>
          <input
            className="field"
            value={state.tagsInput}
            onChange={(event) => setField("tagsInput", event.target.value)}
            placeholder="ai, architecture, product-thinking"
          />
          <span className="mt-1 block text-xs text-[#6b7084]">Comma separated. AI may add more tags automatically.</span>
        </label>
      </div>

      {feedback ? <p className="mt-4 text-sm font-medium text-[#2f6a46]">{feedback}</p> : null}
      {error ? <p className="mt-4 text-sm font-medium text-[#8a2f46]">{error}</p> : null}

      <div className="mt-5 flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Saving..." : "Save Knowledge"}
        </button>
        <button
          type="button"
          className="btn-subtle"
          onClick={() => {
            setState(initialState);
            setFeedback(null);
            setError(null);
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
}

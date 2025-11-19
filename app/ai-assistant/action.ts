"use server";

import { createClient } from "@/supabase/server";

export async function askQuestion(formData: FormData) {
  const supabase = createClient();
  const q = String(formData.get("q") || "").trim();

  if (!q) {
    return { answer: "Please type a question first.", sources: [] };
  }

  const { data: faqs } = await supabase
    .from("faqs")
    .select("id, question, answer, category")
    .textSearch("question", q, { type: "websearch" })
    .limit(5);

  const { data: notices } = await supabase
    .from("notices")
    .select("id, title, content, category, published_at")
    .textSearch("content", q, { type: "websearch" })
    .limit(5);

  const results = [
    ...(faqs ?? []).map(f => ({
      type: "FAQ",
      title: f.question,
      snippet: f.answer,
    })),
    ...(notices ?? []).map(n => ({
      type: "Notice",
      title: n.title,
      snippet: n.content.slice(0, 200),
    })),
  ];

  if (results.length === 0)
    return { answer: `I couldn’t find an answer for “${q}”.`, sources: [] };

  const answer = results
    .map((r, i) => `(${i + 1}) [${r.type}] ${r.title} — ${r.snippet}`)
    .join("\n\n");

  return { answer, sources: results };
}

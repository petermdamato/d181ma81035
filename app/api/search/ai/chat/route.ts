import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { AISearchCriteria, ChatMessage, ChatResponse } from "@/lib/ai-search-types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const QUESTION_ORDER: (keyof AISearchCriteria)[] = [
  "topic",
  "subject_population",
  "data_use",
  "years_dates",
  "ownership",
  "geography",
  "data_type",
  "other_details",
];

const CRITERIA_LABELS: Record<keyof AISearchCriteria, string> = {
  topic: "topic / what they're searching for",
  subject_population: "who or what the data is about (e.g. businesses, people, hospitals, land)",
  years_dates: "years or date ranges needed (or 'Any')",
  ownership: "ownership (public, proprietary, open-source, etc.)",
  data_type: "kind of data (sensor, survey, sentiment analysis, etc.)",
  data_use: "where the data will go (sublicensed, AI training, business intelligence, etc.)",
  geography: "geography or geography levels",
  other_details: "any other requirements (columns, details)",
};

function buildSystemPrompt(currentCriteria: AISearchCriteria): string {
  const lines = [
    "You are a helpful assistant that helps users describe what data vendor they need. You ask short, clear questions one at a time and extract structured criteria from their answers.",
    "",
    "Current criteria (extract and update from the conversation; use null for missing):",
    JSON.stringify(currentCriteria, null, 2),
    "",
    "Question order (ask the FIRST question whose criterion is still null or empty):",
    ...QUESTION_ORDER.map((k) => `- ${k}: ${CRITERIA_LABELS[k]}`),
    "",
    "Rules:",
    "1. After each user message, update the criteria with any new information (topic, subject, years, ownership, data_type, data_use, geography, other_details).",
    "2. Reply with exactly two parts separated by the string '---JSON---': first your natural-language reply (one short paragraph or question), then a JSON object with keys: criteria (object with topic, subject_population, years_dates, ownership, data_type, data_use, geography, other_details; use null for missing), nextMessage (your reply text).",
    "3. If the user's message fills in multiple criteria, still ask only the next missing one.",
    "4. For the first message from the assistant, ask: 'What are you searching for?'",
    "5. Once subject_population is filled, the UI will show a 'SHOW ME RESULTS' button; you don't need to mention it.",
  ];
  return lines.join("\n");
}

function parseResponse(content: string, currentCriteria: AISearchCriteria): ChatResponse {
  const jsonMarker = "---JSON---";
  const idx = content.indexOf(jsonMarker);
  let criteria = currentCriteria;
  let assistantMessage = content.trim();
  if (idx !== -1) {
    assistantMessage = content.slice(0, idx).trim();
    try {
      const raw = content.slice(idx + jsonMarker.length).trim();
      const parsed = JSON.parse(raw) as { criteria?: AISearchCriteria; nextMessage?: string };
      if (parsed.criteria && typeof parsed.criteria === "object") {
        criteria = {
          topic: parsed.criteria.topic ?? criteria.topic,
          subject_population: parsed.criteria.subject_population ?? criteria.subject_population,
          years_dates: parsed.criteria.years_dates ?? criteria.years_dates,
          ownership: parsed.criteria.ownership ?? criteria.ownership,
          data_type: parsed.criteria.data_type ?? criteria.data_type,
          data_use: parsed.criteria.data_use ?? criteria.data_use,
          geography: parsed.criteria.geography ?? criteria.geography,
          other_details: parsed.criteria.other_details ?? criteria.other_details,
        };
      }
      if (typeof parsed.nextMessage === "string" && parsed.nextMessage.trim()) {
        assistantMessage = parsed.nextMessage.trim();
      }
    } catch {
      // keep assistantMessage as first part
    }
  }
  const showResultsButton = !!criteria.subject_population?.trim();
  return { criteria, assistantMessage, showResultsButton };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = body.messages as ChatMessage[] | undefined;
    const criteria = (body.criteria ?? {}) as AISearchCriteria;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array required" },
        { status: 400 }
      );
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt(criteria);
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content }) as const),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      temperature: 0.3,
      max_tokens: 600,
    });

    const content =
      completion.choices[0]?.message?.content ?? "What are you searching for?";
    const response = parseResponse(content, criteria);
    return NextResponse.json(response);
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Chat failed" },
      { status: 500 }
    );
  }
}

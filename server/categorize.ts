import { choice, APIError, APIConnectionError } from "@typesafe-ai/sdk";
import { getJevClient } from "./jevClient";

export const CATEGORIES = ["식비", "교통", "주거", "쇼핑", "의료", "문화", "급여", "기타"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface CategorizeInput {
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
}

export interface CategorizeResult {
  category: Category;
  model: string;
  usage: unknown;
}

// One small decision call: pick a ledger category for a transaction.
export async function categorizeTransaction(input: CategorizeInput): Promise<CategorizeResult> {
  const response = await getJevClient().systemOne({
    state: {
      description: input.description,
      amount: input.amount,
      type: input.type,
    },
    questions: {
      category: choice(
        "Which ledger category best fits this transaction?",
        Object.fromEntries(CATEGORIES.map((c) => [c, null])) as Record<Category, null>,
      ),
    },
  });
  return {
    category: response.answers.category.choice as Category,
    model: response.model,
    usage: response.usage,
  };
}

// Maps SDK errors to a safe message and status, following https://jev-ai.pro/docs#errors.
// Response bodies are not echoed, so nothing sensitive reaches logs or the browser.
export function describeJevError(error: unknown): { status: number; message: string } {
  if (error instanceof APIError) {
    const messages: Record<number, string> = {
      401: "Jev AI key is missing, invalid or revoked.",
      402: "Jev AI balance is insufficient or spending is paused.",
      404: "Jev AI endpoint not found. Check the base URL.",
      422: "Jev AI rejected the request body. Do not retry unchanged.",
      429: "Jev AI rate limit reached. Try again later.",
      502: "Jev AI upstream is unavailable. Try again later.",
      503: "Jev AI upstream is unavailable. Try again later.",
      504: "Jev AI upstream timed out. Check usage before retrying.",
    };
    return {
      status: error.status >= 500 ? 502 : error.status,
      message: messages[error.status] ?? `Jev AI request failed (HTTP ${error.status}).`,
    };
  }
  if (error instanceof APIConnectionError) {
    return { status: 504, message: "Could not reach Jev AI or it timed out. Check usage before retrying." };
  }
  return { status: 500, message: error instanceof Error ? error.message : "Unknown error." };
}

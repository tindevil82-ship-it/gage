import { Transaction } from "../types";

// Browser side: calls our own server, which holds JEV_AI_API_KEY.
export const suggestCategory = async (
  tx: Pick<Transaction, "description" | "amount" | "type">,
): Promise<string | null> => {
  try {
    const res = await fetch("/api/jev/categorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.category === "string" ? data.category : null;
  } catch {
    return null;
  }
};

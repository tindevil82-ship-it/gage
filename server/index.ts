// Minimal API server that keeps JEV_AI_API_KEY off the browser.
// The Vite dev server proxies /api/* here (see vite.config.ts).
import { createServer } from "node:http";
import { CATEGORIES, categorizeTransaction, describeJevError } from "./categorize";

const PORT = Number(process.env.PORT || 3001);
const MAX_BODY_BYTES = 16_000;

const server = createServer(async (req, res) => {
  const send = (status: number, body: unknown) => {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(body));
  };

  if (req.method !== "POST" || req.url !== "/api/jev/categorize") {
    return send(404, { error: "Not found" });
  }

  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY_BYTES) return send(413, { error: "Request too large" });
  }

  let input: { description?: unknown; amount?: unknown; type?: unknown };
  try {
    input = JSON.parse(raw);
  } catch {
    return send(400, { error: "Invalid JSON" });
  }
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const amount = Number(input.amount);
  const type = input.type === "INCOME" ? "INCOME" : "EXPENSE";
  if (!description || !Number.isFinite(amount)) {
    return send(400, { error: "description and amount are required" });
  }

  try {
    const result = await categorizeTransaction({ description, amount, type });
    send(200, result);
  } catch (error) {
    const { status, message } = describeJevError(error);
    console.error(`[jev] categorize failed: ${message}`);
    send(status, { error: message });
  }
});

server.listen(PORT, () => {
  console.log(`API server on http://localhost:${PORT} (categories: ${CATEGORIES.join(", ")})`);
});

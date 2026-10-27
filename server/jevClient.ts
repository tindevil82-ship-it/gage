// Server-only Jev AI client. Never import this file from browser code:
// it reads JEV_AI_API_KEY from the server environment.
import { TypeSafeClient } from "@typesafe-ai/sdk";

// The SDK defaults to TypeSafe's own service (https://api.typesafe.ai).
// Jev AI hosts a compatible endpoint, so baseURL must be set explicitly;
// the SDK appends /v1/systemone and /v1/models to it.
export const JEV_AI_BASE_URL = "https://jev-ai.pro/api";
export const JEV_AI_DEFAULT_MODEL = "jev-latest";

let client: TypeSafeClient | undefined;

export function getJevClient(): TypeSafeClient {
  if (client) return client;
  const apiKey = process.env.JEV_AI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("JEV_AI_API_KEY is not set in the server environment.");
  }
  client = new TypeSafeClient({
    apiKey,
    baseURL: JEV_AI_BASE_URL,
    defaultModel: process.env.JEV_AI_MODEL?.trim() || JEV_AI_DEFAULT_MODEL,
    // `debug` would log request bodies; keep it at `warn`.
    logLevel: "warn",
    timeout: 30_000,
    // Per https://jev-ai.pro/docs#errors: retry only confirmed failures
    // (429 honoring Retry-After, 502, 503). A timeout, dropped connection or
    // 504 may already have been charged, so check usage instead of resending.
    retry: {
      maxRetries: 2,
      httpStatuses: new Set([429, 502, 503]),
      apiConnectionError: false,
      apiTimeoutError: false,
    },
  });
  return client;
}

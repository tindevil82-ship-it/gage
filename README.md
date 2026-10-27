<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10aDzgdJJPq5dqB2-A4sMh5pp7CbeoUZ0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Jev AI (server-side)

Jev AI decisions run through a small Node server so `JEV_AI_API_KEY` never reaches the browser.
The client in `server/jevClient.ts` uses TypeSafe's SDK (`@typesafe-ai/sdk`) with `baseURL`
set explicitly to `https://jev-ai.pro/api`; without it the SDK would call TypeSafe's own service.

1. Create a key at https://jev-ai.pro/jev-api.
2. Put it in `.env.local` (git-ignored) as `JEV_AI_API_KEY=...`. Optionally set `JEV_AI_MODEL` (default `jev-latest`).
3. Check the setup without spending balance: `npm run jev:models` (GET `/v1/models`, no inference).
4. Make one small decision call: `npm run jev:decide` (POST `/v1/systemone`, uses balance).
5. Run the app: `npm run server` and `npm run dev` in two terminals. Vite proxies `/api` to the server.

In deployment, set `JEV_AI_API_KEY` as a secret environment variable on the host that runs
`server/index.ts`. Do not add it to `vite.config.ts` `define`, which would inline it into the browser bundle.

Retries follow https://jev-ai.pro/docs#errors: only 429 (honoring `Retry-After`), 502 and 503 are
retried. Timeouts, dropped connections and 504 are not resent automatically, because the call may
already have been charged.

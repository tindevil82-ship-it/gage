// Verifies the Jev AI setup.
//   npm run jev:models   -> GET  https://jev-ai.pro/api/v1/models (no inference, no charge)
//   npm run jev:decide   -> POST https://jev-ai.pro/api/v1/systemone (one small decision call)
import { categorizeTransaction, describeJevError } from "../server/categorize";
import { getJevClient } from "../server/jevClient";

async function main() {
  const mode = process.argv[2];
  const client = getJevClient();
  console.log(`Destination: ${client.baseURL} (model ${client.defaultModel})`);

  if (mode === "models") {
    const models = await client.models.list();
    for (const m of models) console.log(`- ${m.name}: ${m.description}`);
    return;
  }
  if (mode === "decide") {
    const result = await categorizeTransaction({
      description: "스타벅스 아메리카노",
      amount: 4500,
      type: "EXPENSE",
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.error("Usage: jev-check.ts models|decide");
  process.exitCode = 2;
}

main().catch((error) => {
  const { status, message } = describeJevError(error);
  console.error(`Error (${status}): ${message}`);
  process.exitCode = 1;
});

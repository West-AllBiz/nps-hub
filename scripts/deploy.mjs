import { readFile } from "node:fs/promises";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
if (!accountId || !apiToken) {
  throw new Error("Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN before deploying.");
}

const source = await readFile(new URL("../worker.mjs", import.meta.url), "utf8");
const metadata = {
  main_module: "worker.mjs",
  compatibility_date: "2026-11-12",
  keep_bindings: ["secret_text"],
  bindings: [
    { type: "d1", name: "SESSIONS", database_id: "7d4a407d-0686-497a-924b-82462f98b0b9" },
    { type: "ratelimit", name: "LOGIN_LIMIT", namespace_id: "48151", simple: { limit: 8, period: 60 } },
  ],
  observability: {
    enabled: true,
    logs: { enabled: true, invocation_logs: false },
    traces: { enabled: true, head_sampling_rate: 0.1 },
  },
};

const form = new FormData();
form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
form.append("worker.mjs", new Blob([source], { type: "application/javascript+module" }), "worker.mjs");
const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/workers/scripts/nps-hub`,
  { method: "PUT", headers: { Authorization: `Bearer ${apiToken}` }, body: form },
);
const result = await response.json();
if (!response.ok || !result.success) {
  throw new Error(`Deployment failed (HTTP ${response.status}). Check the Cloudflare API token permissions and dashboard.`);
}
console.log(`Deployed nps-hub version ${result.result.deployment_id}`);

#!/usr/bin/env node
/**
 * Preflight: confirm CURSOR_API_KEY can see LCP_Refresh via Cursor GitHub integration.
 * Run before live agent dispatch (Phase 0 gate 0.8).
 */
import { Cursor, IntegrationNotConnectedError } from '@cursor/sdk';

const EXPECTED_REPO = 'Latestcrazeproductions/LCP_Refresh';
const EXPECTED_URLS = [
  'https://github.com/Latestcrazeproductions/LCP_Refresh',
  'https://github.com/Latestcrazeproductions/LCP_Refresh.git',
];

function normalizeRepoUrl(url: string): string {
  return url.replace(/\.git$/i, '').replace(/\/+$/, '').toLowerCase();
}

async function main() {
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey) {
    console.error('CURSOR_API_KEY is not set.');
    process.exit(1);
  }

  try {
    const repos = await Cursor.repositories.list({ apiKey });
    const normalized = repos.map((r) => normalizeRepoUrl(r.url));

    console.log(`Cursor GitHub integration: ${repos.length} repo(s) connected.`);
    for (const r of repos) {
      console.log(`  - ${r.url}`);
    }

    const connected = EXPECTED_URLS.some((u) => normalized.includes(normalizeRepoUrl(u)));
    if (!connected) {
      console.error(`
::error::${EXPECTED_REPO} is NOT connected to your Cursor team.

Cloud agents cannot verify branches until GitHub is linked to the same team as this API key.

Fix (5 minutes):
  1. Open https://cursor.com/dashboard → Integrations → GitHub
  2. Connect GitHub and install the Cursor app on org/user "Latestcrazeproductions"
  3. Grant access to repository "LCP_Refresh" (or all repos)
  4. Ensure CURSOR_API_KEY in GitHub Actions was created under that same Cursor team
  5. Re-run this workflow

GitHub has branches main and development — this is a Cursor↔GitHub permissions issue, not a wrong branch name.
`);
      process.exit(1);
    }

    console.log(`OK: ${EXPECTED_REPO} is connected for cloud agents.`);
  } catch (err) {
    if (err instanceof IntegrationNotConnectedError) {
      console.error(`
::error::GitHub integration is not connected for this Cursor API key.
Provider: ${err.provider}
Help: ${err.helpUrl ?? 'https://cursor.com/dashboard'}

Connect GitHub, then grant access to ${EXPECTED_REPO}.
`);
      process.exit(1);
    }
    throw err;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

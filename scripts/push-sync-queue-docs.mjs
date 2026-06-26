#!/usr/bin/env node
/** Push docs from .linear-doc-cache/sync-queue → Linear project documents. */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const QUEUE_DIR = join(__dirname, '.linear-doc-cache/sync-queue');
const MANIFEST_PATH = join(__dirname, '.linear-doc-cache/manifest.json');
const STATE_PATH = join(__dirname, 'linear-sync-state.json');
const PROJECT_ID = '09ba430a-8c92-4232-b61f-20209c5b71f9';
const API = 'https://api.linear.app/graphql';

const apiKey = process.env.LINEAR_API_KEY?.trim();
if (!apiKey) {
  console.error('Missing LINEAR_API_KEY');
  process.exit(1);
}

async function gql(query, variables = {}) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data;
}

async function listProjectDocs() {
  const data = await gql(
    `query($id: String!) { project(id: $id) { documents { nodes { id title content url slugId } } } }`,
    { id: PROJECT_ID }
  );
  return data.project?.documents?.nodes ?? [];
}

async function main() {
  const manifest = existsSync(MANIFEST_PATH)
    ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
    : [];
  const hashByPath = new Map(manifest.map((m) => [m.repoPath, m.hash]));

  const state = existsSync(STATE_PATH)
    ? JSON.parse(readFileSync(STATE_PATH, 'utf8'))
    : { documents: {} };
  state.documents ??= {};

  const existing = await listProjectDocs();
  const byMarker = new Map();
  const byTitle = new Map();
  for (const d of existing) {
    byTitle.set(d.title, d);
    const m = d.content?.match(/lcp-doc-sync:(docs\/[^\s]+)/);
    if (m) byMarker.set(m[1], d);
  }

  const files = readdirSync(QUEUE_DIR).filter((f) => f.endsWith('.json')).sort((a, b) => Number(a.replace('.json', '')) - Number(b.replace('.json', '')));
  let created = 0;
  let updated = 0;

  for (const f of files) {
    const p = JSON.parse(readFileSync(join(QUEUE_DIR, f), 'utf8'));
    const repoPath = p.title;
    const raw = p.content.replace(/\n\n---\n<!-- lcp-doc-sync:[^\n]+ -->\n\*Synced from repo · run npm run sync:linear to refresh\*$/, '');
    const hash = hashByPath.get(repoPath) ?? createHash('sha256').update(raw).digest('hex');
    const hit = state.documents[repoPath]?.id
      ? { id: state.documents[repoPath].id }
      : byMarker.get(repoPath) ?? byTitle.get(repoPath);

    if (hit?.id) {
      const data = await gql(
        `mutation($id: String!, $input: DocumentUpdateInput!) {
          documentUpdate(id: $id, input: $input) { document { id slugId title url } }
        }`,
        { id: hit.id, input: { title: p.title, content: p.content } }
      );
      const doc = data.documentUpdate.document;
      state.documents[repoPath] = { id: doc.id, slug: doc.slugId, hash, title: doc.title, url: doc.url };
      updated++;
      console.log('update', repoPath);
    } else {
      const data = await gql(
        `mutation($input: DocumentCreateInput!) {
          documentCreate(input: $input) { document { id slugId title url } }
        }`,
        { input: { title: p.title, content: p.content, projectId: PROJECT_ID } }
      );
      const doc = data.documentCreate.document;
      state.documents[repoPath] = { id: doc.id, slug: doc.slugId, hash, title: doc.title, url: doc.url };
      created++;
      console.log('create', repoPath);
    }
  }

  state.lastSyncAt = new Date().toISOString();
  writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
  console.log(`Done: ${created} created, ${updated} updated`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});

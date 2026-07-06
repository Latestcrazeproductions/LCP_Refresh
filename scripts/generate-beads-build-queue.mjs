/**
 * Generate agent-native beads drafts from scripts/linear-build-plan.json.
 *
 * Scope: build phase only (phase-0 engineering + sprint-1..4). Excludes
 * steady-state, phase-exits, and non-engineering Phase 0 gates.
 *
 * Usage:
 *   node scripts/generate-beads-build-queue.mjs              # summary to stdout
 *   node scripts/generate-beads-build-queue.mjs --write      # write beads-build-queue.json
 *   node scripts/generate-beads-build-queue.mjs --import     # import open todos into local .beads/
 *   node scripts/generate-beads-build-queue.mjs --import --include-done  # import all engineering items
 *
 * Requires `bd init` (stealth ok) before --import.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLAN_PATH = join(__dirname, 'linear-build-plan.json');
const OVERRIDES_PATH = join(__dirname, 'beads-build-overrides.json');
const OUTPUT_PATH = join(__dirname, 'beads-build-queue.json');
const MARKER_PREFIX = 'lcp-build-plan:';

/** Epics imported into beads (excludes steady-state and phase-exits). */
const BUILD_EPICS = new Set(['phase-0', 'sprint-1', 'sprint-2', 'sprint-3', 'sprint-4']);

const DEFAULT_CONSTRAINTS = [
  'PR-only publish gate; branch from `development` → `feature/<topic>`',
  'Do not modify `.env*`, Supabase migrations, or CMS auth without explicit approval',
  'Agent write scope: `src/app/**`, `src/content/`, `content-library/`, `content-registry/`, `scripts/seo-orchestrator/`, `agents/`, `.github/workflows/`',
];

const args = process.argv.slice(2);
const writeFile = args.includes('--write');
const doImport = args.includes('--import');
const includeDone = args.includes('--include-done');
const openOnly = !includeDone;

const plan = JSON.parse(readFileSync(PLAN_PATH, 'utf8'));
const overrides = existsSync(OVERRIDES_PATH)
  ? JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'))
  : { defaults: {} };

function marker(epicKey, issueKey) {
  return `${MARKER_PREFIX}${epicKey}/${issueKey}`;
}

function nodeKey(epicKey, issueKey) {
  return `build-${epicKey}-${issueKey}`.replace(/\./g, '-');
}

function shouldIncludeIssue(epicKey, issue) {
  if (epicKey === 'phase-0' && issue.owner !== 'engineering') {
    return false;
  }
  if (openOnly && issue.status === 'done') {
    return false;
  }
  return true;
}

function priorityFor(epicKey, issue) {
  if (issue.status === 'todo' && epicKey.startsWith('sprint-')) {
    return 1;
  }
  if (epicKey === 'phase-0' && issue.status === 'todo') {
    return 0;
  }
  return 2;
}

function defaultScope(epicKey, issue) {
  if (epicKey.startsWith('sprint-2')) {
    return [
      'scripts/seo-orchestrator/src/dispatch.ts',
      'agents/prompts/',
      '.github/workflows/seo-weekly.yml',
    ];
  }
  if (epicKey.startsWith('sprint-4')) {
    return [
      '.github/workflows/seo-phase-build.yml',
      'content-registry/',
      'scripts/seo-orchestrator/src/qa-checks.ts',
    ];
  }
  if (epicKey === 'phase-0') {
    return ['docs/PHASE_0_CHECKLIST.md', 'content-registry/'];
  }
  return ['scripts/seo-orchestrator/', 'content-registry/', 'agents/'];
}

function defaultVerify(epicKey, issue) {
  const title = issue.title.toLowerCase();
  if (title.includes('dry-run') || title.includes('--dry-run')) {
    return 'cd scripts/seo-orchestrator && npm run seo:run -- --cadence weekly --dry-run exits 0';
  }
  if (title.includes('.yml') || title.includes('workflow')) {
    return 'GitHub Actions workflow_dispatch run is green';
  }
  if (title.includes('npm run')) {
    return `Command succeeds: ${issue.title.split(' ')[0]}`;
  }
  if (epicKey.startsWith('sprint-1')) {
    return 'Deliverable exists in repo; related npm script or route responds as documented in BUILD_PLAN.md';
  }
  return 'Deliverable merged via PR; acceptance in BUILD_PLAN.md satisfied';
}

function buildDescription(epic, issue) {
  const epicKey = epic.key;
  const issueKey = issue.key;
  const ref = marker(epicKey, issueKey);
  const custom = overrides[`${epicKey}/${issueKey}`] ?? {};
  const defaults = overrides.defaults ?? {};

  const lines = [
    '## Objective',
    `${issue.title} (\`${ref}\`).`,
    '',
    '## Build context',
    issue.description || epic.description || '(see BUILD_PLAN.md)',
  ];

  if (custom.agent) {
    lines.push('', '## Agent', `${custom.agent}${custom.track ? ` | track:${custom.track}` : ''}`);
  }

  const scope = custom.scope ?? defaultScope(epicKey, issue);
  lines.push('', '## Scope', ...scope.map((s) => `- ${s}`));

  const constraints = defaults.constraints ?? DEFAULT_CONSTRAINTS;
  lines.push('', '## Constraints', ...constraints.map((c) => `- ${c}`));

  const steps = custom.steps ?? [`Implement: ${issue.description || issue.title}`];
  lines.push('', '## Steps', ...steps.map((s, i) => `${i + 1}. ${s}`));

  const refs = custom.references ?? defaults.references ?? [
    'docs/BUILD_PLAN.md',
    'docs/AGENT_SEO_AUTOMATION.md',
  ];
  lines.push('', '## References', ...refs.map((r) => `- ${r}`), `- Linear marker: \`${ref}\``);

  const verify = custom.verify ?? defaultVerify(epicKey, issue);
  return { description: lines.join('\n'), verify, custom, ref };
}

function collectBuildItems() {
  const epics = [];
  const tasks = [];

  for (const epic of plan.epics) {
    if (!BUILD_EPICS.has(epic.key)) {
      continue;
    }

    const epicNodeKey = nodeKey(epic.key, epic.key);
    const includedIssues = epic.issues.filter((issue) => shouldIncludeIssue(epic.key, issue));

    if (includedIssues.length === 0 && openOnly) {
      continue;
    }

    epics.push({
      key: epicNodeKey,
      epicKey: epic.key,
      title: epic.title,
      description: epic.description,
      status: epic.status,
      type: 'epic',
      externalRef: `${MARKER_PREFIX}epic/${epic.key}`,
      labels: ['build-phase', epic.key],
    });

    for (const issue of includedIssues) {
      const { description, verify, custom, ref } = buildDescription(epic, issue);
      tasks.push({
        key: nodeKey(epic.key, issue.key),
        epicKey: epic.key,
        issueKey: issue.key,
        parentKey: epicNodeKey,
        title: `[${issue.key}] ${issue.title}`,
        description,
        verify,
        externalRef: ref,
        type: 'task',
        status: issue.status,
        priority: priorityFor(epic.key, issue),
        labels: ['build-phase', epic.key, 'engineering', ...(custom.labels ?? [])],
      });
    }
  }

  return { epics, tasks };
}

function buildGraph({ epics, tasks }) {
  const nodes = [];
  const edges = [];

  for (const epic of epics) {
    nodes.push({
      key: epic.key,
      title: epic.title,
      type: 'epic',
      priority: 2,
      labels: epic.labels,
      external_ref: epic.externalRef,
      description: `Build epic: ${epic.description ?? ''}\n\nPlan status: ${epic.status}`,
    });
  }

  for (const task of tasks) {
    nodes.push({
      key: task.key,
      title: task.title,
      type: task.type,
      priority: task.priority,
      labels: task.labels,
      description: task.description,
      acceptance: task.verify,
      external_ref: task.externalRef,
      metadata: {
        plan_status: task.status,
        epic: task.epicKey,
        issue_key: task.issueKey,
      },
    });
    edges.push({ from_key: task.key, to_key: task.parentKey, type: 'parent-child' });
  }

  // Phase 0 engineering todos gate sprint-2+ open work
  const phase0TodoKeys = tasks
    .filter((t) => t.epicKey === 'phase-0' && t.status === 'todo')
    .map((t) => t.key);
  const sprint2PlusKeys = tasks
    .filter((t) => t.epicKey.startsWith('sprint-') && parseInt(t.epicKey.split('-')[1], 10) >= 2)
    .map((t) => t.key);

  for (const blocked of sprint2PlusKeys) {
    for (const blocker of phase0TodoKeys) {
      edges.push({ from_key: blocked, to_key: blocker, type: 'blocks' });
    }
  }

  // Sequential within sprint-2 (2.3 before 2.4)
  const sprint2Tasks = tasks
    .filter((t) => t.epicKey === 'sprint-2')
    .sort((a, b) => a.issueKey.localeCompare(b.issueKey, undefined, { numeric: true }));
  for (let i = 1; i < sprint2Tasks.length; i++) {
    edges.push({
      from_key: sprint2Tasks[i].key,
      to_key: sprint2Tasks[i - 1].key,
      type: 'blocks',
    });
  }

  return {
    generated_at: new Date().toISOString(),
    source: 'scripts/linear-build-plan.json',
    scope: 'build-phase engineering only (no steady-state)',
    nodes,
    edges,
  };
}

function runBd(args, cwd) {
  return spawnSync('bd', args, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function listExistingExternalRefs(repoRoot) {
  const result = runBd(['list', '--json', '--status', 'all'], repoRoot);
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'bd list failed — run bd init first');
  }
  const map = new Map();
  try {
    const rows = JSON.parse(result.stdout || '[]');
    for (const row of rows) {
      if (row.external_ref) {
        map.set(row.external_ref, row.id);
      }
    }
  } catch {
    // empty database
  }
  return map;
}

function importGraph(graph, repoRoot) {
  if (!existsSync(join(repoRoot, '.beads'))) {
    throw new Error('No .beads/ directory — run `bd init --stealth --non-interactive` first');
  }

  const existing = listExistingExternalRefs(repoRoot);
  const filteredNodes = graph.nodes.filter((node) => {
    if (!node.external_ref) {
      return true;
    }
    return !existing.has(node.external_ref);
  });
  const nodeKeys = new Set(filteredNodes.map((n) => n.key));
  const filtered = {
    ...graph,
    nodes: filteredNodes,
    edges: graph.edges.filter(
      (edge) => nodeKeys.has(edge.from_key) && nodeKeys.has(edge.to_key)
    ),
  };

  const skipped = graph.nodes.length - filtered.nodes.length;
  if (filtered.nodes.length === 0) {
    console.log(`Nothing to import (${skipped} already in beads by external_ref).`);
    return;
  }

  const tmpPath = join(__dirname, '.beads-import-tmp.json');
  writeFileSync(tmpPath, JSON.stringify(filtered, null, 2));

  const create = runBd(['create', '--graph', tmpPath], repoRoot);
  if (create.status !== 0) {
    throw new Error(create.stderr || create.stdout || 'bd create --graph failed');
  }

  console.log(create.stdout.trim());

  const keyToId = new Map();
  for (const line of create.stdout.split('\n')) {
    const match = line.trim().match(/^(\S+)\s+->\s+(\S+)/);
    if (match) {
      keyToId.set(match[1], match[2]);
    }
  }

  let patched = 0;
  for (const node of filtered.nodes) {
    if (!node.external_ref && !node.acceptance) {
      continue;
    }
    const id = keyToId.get(node.key);
    if (!id) {
      continue;
    }
    const patchArgs = ['update', id];
    if (node.external_ref) {
      patchArgs.push('--external-ref', node.external_ref);
    }
    if (node.acceptance) {
      patchArgs.push('--acceptance', node.acceptance);
    }
    const patch = runBd(patchArgs, repoRoot);
    if (patch.status === 0) {
      patched += 1;
    }
  }

  console.log(`Imported ${filtered.nodes.length} node(s); skipped ${skipped} existing; patched ${patched} with external_ref/acceptance.`);
  console.log('Run `bd ready` to see unblocked build work.');
}

function printSummary(graph) {
  const tasks = graph.nodes.filter((n) => n.type === 'task');
  const epics = graph.nodes.filter((n) => n.type === 'epic');
  const openTasks = tasks.filter((n) => n.metadata?.plan_status !== 'done');

  console.log('Beads build queue draft');
  console.log(`  Source: ${graph.source}`);
  console.log(`  Scope:  ${graph.scope}`);
  console.log(`  Epics:  ${epics.length}`);
  console.log(`  Tasks:  ${tasks.length} (${openTasks.length} non-done in plan)`);
  console.log(`  Edges:  ${graph.edges.length}`);
  console.log('');
  console.log('Open engineering tasks:');
  for (const t of openTasks) {
    console.log(`  - ${t.title} [plan: ${t.metadata?.plan_status}]`);
    console.log(`    ref: ${t.external_ref}`);
  }
  console.log('');
  console.log('Next steps:');
  console.log('  node scripts/generate-beads-build-queue.mjs --write');
  console.log('  node scripts/generate-beads-build-queue.mjs --import');
  console.log('  bd ready');
}

const repoRoot = join(__dirname, '..');
const items = collectBuildItems();
const graph = buildGraph(items);

if (writeFile) {
  writeFileSync(OUTPUT_PATH, JSON.stringify(graph, null, 2));
  console.log(`Wrote ${OUTPUT_PATH}`);
}

if (doImport) {
  importGraph(graph, repoRoot);
} else if (!writeFile) {
  printSummary(graph);
}

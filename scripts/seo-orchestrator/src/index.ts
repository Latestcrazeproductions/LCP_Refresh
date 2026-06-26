#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  advanceRotationWeek,
  getRegistryPaths,
  loadConfig,
  loadJson,
  loadPages,
  loadRotation,
  saveRotation,
} from './registry.js';
import { scheduleTasks, contentMixSummary } from './scheduler.js';
import { buildFunnelGapReport, formatGapReportMarkdown } from './demand-math.js';
import { formatCtaAuditMarkdown, runCtaAudit } from './conversion-audit.js';
import { dispatchTasks } from './dispatch.js';
import type { Cadence } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');

function parseArgs(argv: string[]) {
  let cadence: Cadence = 'weekly';
  let dryRun = false;
  let maxTasks = 5;
  let advanceRotation = false;

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') dryRun = true;
    else if (a === '--advance-rotation') advanceRotation = true;
    else if (a === '--cadence' && argv[i + 1]) cadence = argv[++i] as Cadence;
    else if (a === '--max-tasks' && argv[i + 1]) maxTasks = Number(argv[++i]);
  }

  return { cadence, dryRun, maxTasks, advanceRotation };
}

async function main() {
  const { cadence, dryRun, maxTasks, advanceRotation } = parseArgs(process.argv);
  const paths = getRegistryPaths(REPO_ROOT);
  const config = loadConfig(paths);
  const rotation = loadRotation(paths);
  const pages = loadPages(paths);
  const research = loadJson<{ lastScanAt: string | null }>(paths, 'research.json');

  const effectiveMax = Math.min(maxTasks, config.maxTasksPerRun ?? 5);

  const tasks = scheduleTasks({
    cadence,
    config,
    rotation,
    pages,
    researchLastScanAt: research.lastScanAt,
    maxTasks: effectiveMax,
  });

  const mix = contentMixSummary(tasks);

  console.log(JSON.stringify({ cadence, dryRun, week: rotation.week, taskCount: tasks.length, mix, tasks }, null, 2));

  if (cadence === 'monthly') {
    const metrics = loadJson<{ targets: Record<string, number | null>; actuals: Record<string, number | null> }>(
      paths,
      'metrics.json'
    );
    console.log('\n' + formatGapReportMarkdown(buildFunnelGapReport(metrics)));

    const { rows } = runCtaAudit(pages, {});
    console.log('\n' + formatCtaAuditMarkdown(rows));
  }

  if (dryRun) {
    console.error('\n[dry-run] No agents dispatched.');
    return;
  }

  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    console.error('\nCURSOR_API_KEY not set. Use --dry-run or configure GitHub secret (Phase 0 gate 0.8).');
    process.exit(1);
  }

  const results = await dispatchTasks(REPO_ROOT, tasks, apiKey);
  const failed = results.filter((r) => r.status === 'error');
  if (failed.length) {
    console.error('\nDispatch failures:', failed);
    process.exit(2);
  }

  if (advanceRotation && cadence === 'weekly') {
    saveRotation(paths, advanceRotationWeek(rotation));
    console.error('\nAdvanced rotation week.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

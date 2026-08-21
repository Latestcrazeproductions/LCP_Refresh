#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  advanceRotationDaily,
  advanceRotationWeek,
  getRegistryPaths,
  loadConfig,
  loadJson,
  loadPages,
  loadRotation,
  saveRotation,
} from './registry.js';
import { scheduleTasks, contentMixSummary } from './scheduler.js';
import {
  applyDispatchResults,
  blockedTargetKeys,
  loadReservations,
  reconcileReservations,
  reserveTasks,
  saveReservations,
} from './reservations.js';
import { buildFunnelGapReport, formatGapReportMarkdown } from './demand-math.js';
import { formatCtaAuditMarkdown, runCtaAudit } from './conversion-audit.js';
import { dispatchTasks, getAgentRef, getStartingRef } from './dispatch.js';
import type { Cadence, ContentTopic } from './types.js';
import { DAILY_CATEGORY_ORDER } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');

function parseArgs(argv: string[]) {
  let cadence: Cadence = 'weekly';
  let dryRun = false;
  let maxTasks = 5;
  let advanceRotation = false;
  let onlyType: string | undefined;
  let retryTarget: string | undefined;

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') dryRun = true;
    else if (a === '--advance-rotation') advanceRotation = true;
    else if (a === '--cadence' && argv[i + 1]) cadence = argv[++i] as Cadence;
    else if (a === '--max-tasks' && argv[i + 1]) maxTasks = Number(argv[++i]);
    else if (a === '--only-type' && argv[i + 1]) onlyType = argv[++i];
    else if (a === '--retry-target' && argv[i + 1]) retryTarget = argv[++i];
  }

  return { cadence, dryRun, maxTasks, advanceRotation, onlyType, retryTarget };
}

function readTopicsFile(filePath: string): { topics: ContentTopic[] } {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as { topics: ContentTopic[] };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Invalid topics JSON at ${filePath}: ${detail}`);
  }
}

async function main() {
  const { cadence, dryRun, maxTasks, advanceRotation, onlyType, retryTarget } = parseArgs(process.argv);
  const paths = getRegistryPaths(REPO_ROOT);
  const config = loadConfig(paths);
  const rotation = loadRotation(paths);
  const pages = loadPages(paths);
  const research = loadJson<{ lastScanAt: string | null }>(paths, 'research.json');
  const nationalTopics = readTopicsFile(
    path.join(REPO_ROOT, 'content-library/topics/national-blog-topics.json')
  );
  const strategyTopics = readTopicsFile(
    path.join(REPO_ROOT, 'content-library/topics/strategy-blog-topics.json')
  );
  const reservations = reconcileReservations(
    loadReservations(paths.root),
    pages,
    [...nationalTopics.topics, ...strategyTopics.topics]
  );

  const effectiveMax = Math.min(maxTasks, config.maxTasksPerRun ?? 5);
  const scheduleCap = onlyType ? 50 : effectiveMax;

  let tasks = scheduleTasks({
    cadence,
    config,
    rotation,
    pages,
    researchLastScanAt: research.lastScanAt,
    maxTasks: scheduleCap,
    nationalTopics: nationalTopics.topics,
    strategyTopics: strategyTopics.topics,
    blockedTargetKeys: blockedTargetKeys(reservations, retryTarget),
  });

  if (onlyType) {
    tasks = tasks.filter((t) => t.type === onlyType);
    if (!tasks.length) {
      console.error(`No tasks matched --only-type ${onlyType} for cadence ${cadence}.`);
      process.exit(1);
    }
    tasks = tasks.slice(0, effectiveMax);
  }

  const mix = contentMixSummary(tasks);

  console.log(
    JSON.stringify(
      {
        cadence,
        dryRun,
        agentRef: getAgentRef(),
        startingRef: getStartingRef(),
        week: rotation.week,
        dailyCategories: cadence === 'daily' ? DAILY_CATEGORY_ORDER : undefined,
        taskCount: tasks.length,
        mix,
        tasks,
      },
      null,
      2
    )
  );

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

  const dispatchedTasks = tasks.filter((task) => task.agent !== 'PlannerAgent');
  let updatedReservations = reserveTasks(reservations, dispatchedTasks, cadence);
  saveReservations(paths.root, updatedReservations);

  const results = await dispatchTasks(REPO_ROOT, tasks, apiKey);
  updatedReservations = applyDispatchResults(updatedReservations, results);
  saveReservations(paths.root, updatedReservations);
  const failed = results.filter((r) => r.status === 'error');
  if (failed.length) {
    console.error('\nDispatch failures:', failed);
    process.exit(2);
  }

  if (advanceRotation && cadence === 'daily') {
    saveRotation(paths, advanceRotationDaily(rotation));
    console.error('\nAdvanced daily rotation counters.');
  } else if (advanceRotation && cadence === 'weekly') {
    saveRotation(paths, advanceRotationWeek(rotation));
    console.error('\nAdvanced rotation week.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

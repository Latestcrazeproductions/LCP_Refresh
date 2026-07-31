import fs from 'node:fs';
import path from 'node:path';
import type {
  Cadence,
  ContentTopic,
  PageRecord,
  ReservationLedger,
  Task,
  TaskReservation,
} from './types.js';
import type { DispatchResult } from './dispatch.js';

export const EMPTY_LEDGER: ReservationLedger = { version: 1, reservations: [] };

export function loadReservations(registryRoot: string): ReservationLedger {
  const file = path.join(registryRoot, 'task-reservations.json');
  if (!fs.existsSync(file)) return structuredClone(EMPTY_LEDGER);
  return JSON.parse(fs.readFileSync(file, 'utf8')) as ReservationLedger;
}

export function saveReservations(registryRoot: string, ledger: ReservationLedger): void {
  fs.writeFileSync(
    path.join(registryRoot, 'task-reservations.json'),
    JSON.stringify(ledger, null, 2) + '\n'
  );
}

export function blockedTargetKeys(
  ledger: ReservationLedger,
  retryTarget?: string
): Set<string> {
  return new Set(
    ledger.reservations
      .filter((reservation) => reservation.targetKey !== retryTarget)
      .filter((reservation) => reservation.status === 'in_review' || reservation.status === 'failed')
      .map((reservation) => reservation.targetKey)
  );
}

export function reconcileReservations(
  ledger: ReservationLedger,
  pages: PageRecord[],
  topics: ContentTopic[]
): ReservationLedger {
  const publishedTopics = new Set(
    topics.filter((topic) => topic.status === 'published').map((topic) => topic.slug)
  );
  return {
    version: 1,
    reservations: ledger.reservations.map((reservation) => {
      if (reservation.status !== 'in_review') return reservation;
      const dispatchedDate = reservation.dispatchedAt.slice(0, 10);
      const page = pages.find(
        (candidate) =>
          candidate.url === reservation.targetKey ||
          candidate.url === `/blog/${reservation.targetKey}`
      );
      const topicComplete =
        (reservation.type === 'blog.national.create' ||
          reservation.type === 'authority.strategy_blog') &&
        publishedTopics.has(reservation.targetKey) &&
        page?.implementationStatus === 'live';
      const pageComplete =
        !reservation.type.includes('blog') &&
        page?.implementationStatus === 'live' &&
        Boolean(page.lastUpdated && page.lastUpdated >= dispatchedDate);
      return topicComplete || pageComplete
        ? { ...reservation, status: 'completed', error: undefined }
        : reservation;
    }),
  };
}

export function reserveTasks(
  ledger: ReservationLedger,
  tasks: Task[],
  cadence: Cadence,
  dispatchedAt = new Date().toISOString()
): ReservationLedger {
  const reservations = [...ledger.reservations];
  for (const task of tasks) {
    const next: TaskReservation = {
      taskId: task.id,
      type: task.type,
      targetKey: task.targetKey,
      status: 'in_review',
      cadence,
      dispatchedAt,
    };
    const index = reservations.findIndex(
      (reservation) =>
        reservation.type === task.type && reservation.targetKey === task.targetKey
    );
    if (index >= 0) reservations[index] = next;
    else reservations.push(next);
  }
  return { version: 1, reservations };
}

export function applyDispatchResults(
  ledger: ReservationLedger,
  results: DispatchResult[]
): ReservationLedger {
  const byTask = new Map(results.map((result) => [result.taskId, result]));
  return {
    version: 1,
    reservations: ledger.reservations.map((reservation) => {
      const result = byTask.get(reservation.taskId);
      if (!result) return reservation;
      return {
        ...reservation,
        status: result.status === 'finished' ? 'in_review' : 'failed',
        runId: result.runId,
        agentId: result.agentId,
        error: result.error,
      };
    }),
  };
}

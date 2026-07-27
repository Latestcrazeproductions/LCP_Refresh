import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyDispatchResults,
  blockedTargetKeys,
  reconcileReservations,
  reserveTasks,
} from './reservations.js';
import type { ReservationLedger, Task } from './types.js';

const task: Task = {
  id: 'blog.national.create:led-wall-sizing-for-events',
  type: 'blog.national.create',
  agent: 'NationalContentAgent',
  track: 'A',
  targetKey: 'led-wall-sizing-for-events',
  url: '/blog/led-wall-sizing-for-events',
  description: 'Create LED wall sizing article',
};

test('in-review and failed targets remain blocked', () => {
  const reserved = reserveTasks(
    { version: 1, reservations: [] },
    [task],
    'weekly',
    '2026-07-27T00:00:00.000Z'
  );
  assert.equal(blockedTargetKeys(reserved).has(task.targetKey), true);

  const failed = applyDispatchResults(reserved, [
    {
      taskId: task.id,
      agent: task.agent,
      status: 'error',
      error: 'agent failed',
    },
  ]);
  assert.equal(blockedTargetKeys(failed).has(task.targetKey), true);
});

test('explicit retry unblocks only the requested failed target', () => {
  const ledger: ReservationLedger = {
    version: 1,
    reservations: [
      {
        taskId: task.id,
        type: task.type,
        targetKey: task.targetKey,
        status: 'failed',
        cadence: 'weekly',
        dispatchedAt: '2026-07-27T00:00:00.000Z',
      },
      {
        taskId: 'blog.national.create:another-topic',
        type: task.type,
        targetKey: 'another-topic',
        status: 'failed',
        cadence: 'weekly',
        dispatchedAt: '2026-07-27T00:00:00.000Z',
      },
    ],
  };
  const blocked = blockedTargetKeys(ledger, task.targetKey);
  assert.equal(blocked.has(task.targetKey), false);
  assert.equal(blocked.has('another-topic'), true);
});

test('published content reconciles an in-review reservation to completed', () => {
  const reserved = reserveTasks(
    { version: 1, reservations: [] },
    [task],
    'weekly',
    '2026-07-27T00:00:00.000Z'
  );
  const reconciled = reconcileReservations(
    reserved,
    [
      {
        url: '/blog/led-wall-sizing-for-events',
        layer: 'national',
        type: 'blog',
        track: 'A',
        tier: 'monthly',
        phase: 1,
        lastUpdated: '2026-07-27',
        implementationStatus: 'live',
      },
    ],
    [
      {
        slug: 'led-wall-sizing-for-events',
        title: 'How to Size LED Walls for Corporate Events',
        track: 'A',
        status: 'published',
      },
    ]
  );
  assert.equal(reconciled.reservations[0]?.status, 'completed');
  assert.equal(blockedTargetKeys(reconciled).has(task.targetKey), false);
});

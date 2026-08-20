import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scheduleTasks } from './scheduler.js';
import type {
  ContentTopic,
  PageRecord,
  RegistryConfig,
  RotationState,
} from './types.js';

const config: RegistryConfig = {
  phase: 1,
  allowNewGeoSites: false,
  flagshipDomain: 'latestcrazeproductions.com',
  nationwideHubUrl: '/nationwide-event-production',
  researchStaleDays: 35,
  maxTasksPerRun: 5,
};

const rotation: RotationState = {
  week: 1,
  geoBatchA: [],
  geoBatchB: [],
  serviceRotationIndex: 0,
  strategyBlogWeek: false,
  lastAdvancedAt: null,
};

const topics: ContentTopic[] = [
  { slug: 'reserved-topic', title: 'Reserved', track: 'A', status: 'queued' },
  { slug: 'next-topic', title: 'Next', track: 'A', status: 'queued' },
];

function weekly(pages: PageRecord[], blockedTargetKeys = new Set<string>()) {
  return scheduleTasks({
    cadence: 'weekly',
    config,
    rotation,
    pages,
    researchLastScanAt: null,
    maxTasks: 5,
    nationalTopics: topics,
    strategyTopics: [],
    blockedTargetKeys,
  });
}

test('weekly scheduler skips a reserved content target', () => {
  const tasks = weekly([], new Set(['reserved-topic']));
  const blog = tasks.find((task) => task.type === 'blog.national.create');
  assert.equal(blog?.targetKey, 'next-topic');
  assert.equal(blog?.id, 'blog.national.create:next-topic');
});

test('weekly scheduler does not refresh a planned nationwide hub', () => {
  const pages: PageRecord[] = [
    {
      url: '/nationwide-event-production',
      layer: 'national',
      type: 'hub',
      track: 'A',
      tier: 'quarterly',
      phase: 1,
      implementationStatus: 'planned',
    },
  ];
  const tasks = weekly(pages);
  assert.equal(tasks.some((task) => task.type === 'service.date_touch'), false);
});

test('weekly scheduler refreshes a live nationwide hub', () => {
  const pages: PageRecord[] = [
    {
      url: '/nationwide-event-production',
      layer: 'national',
      type: 'hub',
      track: 'A',
      tier: 'quarterly',
      phase: 1,
      implementationStatus: 'live',
    },
  ];
  const tasks = weekly(pages);
  assert.equal(tasks.some((task) => task.type === 'service.date_touch'), true);
});

function daily(
  pages: PageRecord[],
  rotationOverride: Partial<RotationState> = {},
  blockedTargetKeys = new Set<string>()
) {
  return scheduleTasks({
    cadence: 'daily',
    config,
    rotation: { ...rotation, ...rotationOverride },
    pages,
    researchLastScanAt: null,
    maxTasks: 5,
    nationalTopics: topics,
    strategyTopics: [{ slug: 'strategy-topic', title: 'Strategy', track: 'B', status: 'queued' }],
    blockedTargetKeys,
  });
}

test('daily scheduler emits one task per category', () => {
  const tasks = daily([]);
  assert.equal(tasks.length, 5);
  assert.equal(tasks.filter((t) => t.type === 'blog.national.create').length, 2);
  assert.ok(tasks.some((t) => t.type === 'service.gallery_swap'));
  assert.ok(tasks.some((t) => t.type === 'authority.strategy_blog'));
  assert.ok(tasks.some((t) => t.type === 'authority.case_study'));
});

test('daily scheduler skips reserved capture topics and picks next', () => {
  const tasks = daily([], {}, new Set(['reserved-topic']));
  const blogs = tasks.filter((t) => t.type === 'blog.national.create');
  assert.ok(blogs.every((t) => t.targetKey === 'next-topic'));
});

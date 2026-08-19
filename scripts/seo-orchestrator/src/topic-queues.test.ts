import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTopicReplenishDescription,
  getTopicQueueSnapshot,
} from './topic-queues.js';
import type { ContentTopic, RegistryConfig } from './types.js';

const config: RegistryConfig = {
  phase: 1,
  allowNewGeoSites: false,
  flagshipDomain: 'latestcrazeproductions.com',
  nationwideHubUrl: '/nationwide-event-production',
  researchStaleDays: 35,
  maxTasksPerRun: 5,
  topicQueues: {
    nationalCaptureMinQueued: 45,
    strategyMinQueued: 22,
  },
};

const national: ContentTopic[] = [
  { slug: 'a', title: 'A', track: 'A', status: 'queued' },
  { slug: 'b', title: 'B', track: 'A', status: 'published' },
];

const strategy: ContentTopic[] = [{ slug: 's1', title: 'S', track: 'B', status: 'queued' }];

test('topic queue snapshot calculates deficits', () => {
  const snapshot = getTopicQueueSnapshot(config, national, strategy);
  assert.equal(snapshot.national.queued, 1);
  assert.equal(snapshot.national.deficit, 44);
  assert.equal(snapshot.strategy.queued, 1);
  assert.equal(snapshot.strategy.deficit, 21);
});

test('replenish description includes deficit counts', () => {
  const snapshot = getTopicQueueSnapshot(config, national, strategy);
  const description = buildTopicReplenishDescription(snapshot);
  assert.match(description, /add 44 new topics/);
  assert.match(description, /add 21 new topics/);
});

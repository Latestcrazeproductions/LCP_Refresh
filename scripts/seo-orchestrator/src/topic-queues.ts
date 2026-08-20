import type { ContentTopic, RegistryConfig } from './types.js';

export interface TopicQueueTargets {
  nationalCaptureMinQueued: number;
  strategyMinQueued: number;
}

export interface TopicQueueSnapshot {
  national: { queued: number; published: number; minQueued: number; deficit: number };
  strategy: { queued: number; published: number; minQueued: number; deficit: number };
}

export const DEFAULT_TOPIC_QUEUE_TARGETS: TopicQueueTargets = {
  /** ~2 capture blogs/day × 22 weekdays (capture + geo fallback slots). */
  nationalCaptureMinQueued: 45,
  /** ~1 strategy blog/day × 22 weekdays. */
  strategyMinQueued: 22,
};

export function resolveTopicQueueTargets(config: RegistryConfig): TopicQueueTargets {
  return {
    nationalCaptureMinQueued:
      config.topicQueues?.nationalCaptureMinQueued ?? DEFAULT_TOPIC_QUEUE_TARGETS.nationalCaptureMinQueued,
    strategyMinQueued:
      config.topicQueues?.strategyMinQueued ?? DEFAULT_TOPIC_QUEUE_TARGETS.strategyMinQueued,
  };
}

function countByStatus(topics: ContentTopic[] | undefined, status: ContentTopic['status']): number {
  return (topics ?? []).filter((topic) => topic.status === status).length;
}

export function getTopicQueueSnapshot(
  config: RegistryConfig,
  nationalTopics: ContentTopic[] | undefined,
  strategyTopics: ContentTopic[] | undefined
): TopicQueueSnapshot {
  const targets = resolveTopicQueueTargets(config);
  const nationalQueued = countByStatus(nationalTopics, 'queued');
  const strategyQueued = countByStatus(strategyTopics, 'queued');

  return {
    national: {
      queued: nationalQueued,
      published: countByStatus(nationalTopics, 'published'),
      minQueued: targets.nationalCaptureMinQueued,
      deficit: Math.max(0, targets.nationalCaptureMinQueued - nationalQueued),
    },
    strategy: {
      queued: strategyQueued,
      published: countByStatus(strategyTopics, 'published'),
      minQueued: targets.strategyMinQueued,
      deficit: Math.max(0, targets.strategyMinQueued - strategyQueued),
    },
  };
}

export function buildTopicReplenishDescription(snapshot: TopicQueueSnapshot): string {
  const lines = [
    'Monthly topic queue replenishment.',
    `National capture (Track A): ${snapshot.national.queued}/${snapshot.national.minQueued} queued — add ${snapshot.national.deficit} new topics to content-library/topics/national-blog-topics.json.`,
    `Strategy (Track B): ${snapshot.strategy.queued}/${snapshot.strategy.minQueued} queued — add ${snapshot.strategy.deficit} new topics to content-library/topics/strategy-blog-topics.json.`,
    'If queues already meet targets, add 5 national + 3 strategy fresh topics for the next month and re-rank opportunityScore on queued items.',
    'Write briefs in content-library/research/briefs/ for the top 5 new topics by opportunityScore.',
    'Update content-registry/research.json with lastScanAt and priorityQueue.',
  ];
  return lines.join(' ');
}

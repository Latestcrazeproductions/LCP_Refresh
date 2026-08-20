#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, getRegistryPaths } from './registry.js';
import {
  buildTopicReplenishDescription,
  getTopicQueueSnapshot,
} from './topic-queues.js';
import type { ContentTopic } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');

function loadTopics(name: string): ContentTopic[] {
  const file = path.join(REPO_ROOT, 'content-library/topics', name);
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as { topics: ContentTopic[] };
  return data.topics;
}

const paths = getRegistryPaths(REPO_ROOT);
const config = loadConfig(paths);
const snapshot = getTopicQueueSnapshot(config, loadTopics('national-blog-topics.json'), loadTopics('strategy-blog-topics.json'));

console.log(JSON.stringify(snapshot, null, 2));
console.log('\n' + buildTopicReplenishDescription(snapshot));

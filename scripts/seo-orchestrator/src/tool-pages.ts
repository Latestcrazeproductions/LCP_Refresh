import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_TOOL_PAGE_URL = '/resources/event-production-checklist';
const DEFAULT_TOOL_SLUG = 'event-production-checklist';
const TOOL_MIN_WORDS = 400;

function repoRoot(): string {
  return path.resolve(process.cwd(), process.cwd().endsWith('seo-orchestrator') ? '../..' : '.');
}

export function resourceMarkdownWordCount(slug: string = DEFAULT_TOOL_SLUG): number {
  const file = path.join(repoRoot(), 'content-library/resources', `${slug}.md`);
  if (!fs.existsSync(file)) return 0;
  const raw = fs.readFileSync(file, 'utf8');
  const body = raw.replace(/^---[\s\S]*?---\n?/, '');
  return body.split(/\s+/).filter(Boolean).length;
}

function slugFromResourceUrl(url: string): string | null {
  const match = url.match(/^\/resources\/([^/]+)$/);
  return match?.[1] ?? null;
}

/** True when the planning tool is missing or still a thin placeholder despite being live. */
export function needsToolPageBuild(
  pages: Array<{ url: string; implementationStatus?: string }>,
  url: string = DEFAULT_TOOL_PAGE_URL
): boolean {
  const record = pages.find((page) => page.url === url);
  if (!record || record.implementationStatus !== 'live') return true;
  const slug = slugFromResourceUrl(url);
  if (!slug) return true;
  return resourceMarkdownWordCount(slug) < TOOL_MIN_WORDS;
}

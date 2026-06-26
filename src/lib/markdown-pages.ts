import fs from 'node:fs';
import path from 'node:path';

export type ContentSection = 'blogs' | 'work' | 'resources';

export interface MarkdownPage {
  slug: string;
  title: string;
  description: string;
  body: string;
  track?: string;
  dateModified?: string;
}

const ROOT = path.join(process.cwd(), 'content-library');

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith('---\n')) {
    return { meta: {}, body: raw };
  }
  const end = raw.indexOf('\n---\n', 4);
  if (end === -1) return { meta: {}, body: raw };
  const fm = raw.slice(4, end);
  const body = raw.slice(end + 5);
  const meta: Record<string, string> = {};
  for (const line of fm.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body };
}

export function getMarkdownPage(section: ContentSection, slug: string): MarkdownPage | null {
  const file = path.join(ROOT, section, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  return {
    slug,
    title: meta.title ?? slug,
    description: meta.description ?? '',
    body,
    track: meta.track,
    dateModified: meta.dateModified,
  };
}

export function listMarkdownSlugs(section: ContentSection): string[] {
  const dir = path.join(ROOT, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function markdownToHtml(md: string): string {
  return md
    .split('\n\n')
    .map((block) => {
      if (block.startsWith('## ')) {
        return `<h2 class="text-2xl font-semibold mt-8 mb-4">${block.slice(3)}</h2>`;
      }
      if (block.startsWith('# ')) {
        return `<h1 class="text-3xl font-bold mb-6">${block.slice(2)}</h1>`;
      }
      const withLinks = block.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-400 hover:underline">$1</a>'
      );
      return `<p class="mb-4 text-white/80 leading-relaxed">${withLinks.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');
}

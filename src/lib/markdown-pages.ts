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
  eyebrow?: string;
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function processInline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="font-semibold text-white">$1</strong>'
  );
  out = out.replace(/\*([^*]+)\*/g, '<em class="italic text-white/90">$1</em>');
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline">$1</a>'
  );
  return out;
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
    eyebrow: meta.eyebrow,
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

export function listMarkdownPages(section: ContentSection): MarkdownPage[] {
  return listMarkdownSlugs(section)
    .map((slug) => getMarkdownPage(section, slug))
    .filter((page): page is MarkdownPage => page !== null);
}

export function markdownToHtml(md: string): string {
  const blocks = md.trim().split(/\n\n+/);
  const html: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    html.push(
      `<ul class="mb-6 space-y-3">${listItems
        .map(
          (item) =>
            `<li class="flex items-start gap-3 text-white/80 leading-relaxed"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span><span>${item}</span></li>`
        )
        .join('')}</ul>`
    );
    listItems = [];
  };

  for (const block of blocks) {
    const lines = block.split('\n');
    const isListBlock = lines.every((line) => line.startsWith('- ') || line.trim() === '');
    const isOrderedListBlock = lines.every(
      (line) => /^\d+\.\s+/.test(line) || line.trim() === ''
    );

    if (isListBlock && lines.some((line) => line.startsWith('- '))) {
      flushList();
      listItems = lines
        .filter((line) => line.startsWith('- '))
        .map((line) => processInline(line.slice(2).trim()));
      flushList();
      continue;
    }

    if (isOrderedListBlock && lines.some((line) => /^\d+\.\s+/.test(line))) {
      flushList();
      const items = lines
        .filter((line) => /^\d+\.\s+/.test(line))
        .map((line) => processInline(line.replace(/^\d+\.\s+/, '').trim()));
      html.push(
        `<ol class="mb-6 space-y-3">${items
          .map(
            (item, index) =>
              `<li class="flex items-start gap-3 text-white/80 leading-relaxed"><span class="mt-0.5 shrink-0 font-mono text-sm text-blue-400/90">${index + 1}.</span><span>${item}</span></li>`
          )
          .join('')}</ol>`
      );
      continue;
    }

    flushList();

    if (block.startsWith('### ')) {
      html.push(
        `<h3 class="text-lg font-semibold mt-8 mb-3 text-white">${processInline(block.slice(4))}</h3>`
      );
    } else if (block.startsWith('## ')) {
      html.push(
        `<h2 class="text-2xl font-semibold mt-10 mb-4 text-white border-t border-white/5 pt-8 first:border-0 first:pt-0">${processInline(block.slice(3))}</h2>`
      );
    } else if (block.startsWith('# ')) {
      // Skip top-level H1 — rendered in page hero
      continue;
    } else {
      html.push(
        `<p class="mb-5 text-white/80 leading-relaxed text-lg">${processInline(block.replace(/\n/g, ' '))}</p>`
      );
    }
  }

  flushList();
  return html.join('\n');
}

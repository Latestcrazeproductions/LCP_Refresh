/** CMS auto-ids from the event-type editor (`event-type-${Date.now()}`). */
export function isCmsJunkEventSlug(id: string): boolean {
  return id.startsWith('event-type-');
}

export type EventTypeSitemapSource = { id?: string; title?: string };

export type EventTypeSitemapPage = { path: string; title: string };

/**
 * Canonical event-type URLs for sitemap.xml.
 * Always includes default (git) slugs, overlays CMS titles/extras, and drops `event-type-*` junk.
 */
export function buildEventTypeSitemapPages(
  defaultItems: EventTypeSitemapSource[],
  cmsItems: EventTypeSitemapSource[] | undefined
): EventTypeSitemapPage[] {
  const pages = new Map<string, EventTypeSitemapPage>();

  const add = (id: string | undefined, title: string | undefined) => {
    const slug = id?.trim();
    if (!slug || isCmsJunkEventSlug(slug)) return;
    const path = `/events/${slug}`;
    pages.set(path, { path, title: title?.trim() || slug });
  };

  for (const item of defaultItems) add(item.id, item.title);
  for (const item of cmsItems ?? []) add(item.id, item.title);

  const ordered: EventTypeSitemapPage[] = [];
  const seen = new Set<string>();
  for (const item of defaultItems) {
    const slug = item.id?.trim();
    if (!slug || isCmsJunkEventSlug(slug)) continue;
    const path = `/events/${slug}`;
    const entry = pages.get(path);
    if (entry) {
      ordered.push(entry);
      seen.add(path);
    }
  }
  for (const [path, entry] of pages) {
    if (!seen.has(path)) ordered.push(entry);
  }
  return ordered;
}

/** CMS slugs plus git defaults so restored canonical event URLs can prerender. */
export function indexableEventTypeSlugs(
  defaultIds: Array<string | undefined>,
  cmsIds: Array<string | undefined>
): string[] {
  const slugs: string[] = [];
  const seen = new Set<string>();
  for (const id of [...defaultIds, ...cmsIds]) {
    const slug = id?.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
  }
  return slugs;
}

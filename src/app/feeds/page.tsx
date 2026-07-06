import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ContentProvider } from '@/context/ContentContext';
import { getSiteContent } from '@/lib/content';
import { getFeedPageContent } from '@/content/feed-examples';
import { listFeedPreviewEntries } from '@/lib/feed-registry';
import { PageShell } from '@/components/layout/PageShell';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/layout/SectionHeader';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Feed Page Previews',
  description: 'Layout previews for SEO feed landing pages — review before scaling to the full matrix.',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/feeds` },
};

const PATTERN_LABELS: Record<string, string> = {
  'head-service': 'National head term',
  'head-service-event': 'Service × event type',
  'core-service': 'Technical capability',
  'service-location': 'Geo · service + city',
};

export default async function FeedsIndexPage() {
  const siteContent = await getSiteContent();
  const previews = listFeedPreviewEntries();

  return (
    <ContentProvider content={siteContent}>
      <PageShell>
        <PageHero
          eyebrow="Layout preview"
          title="Feed landing pages"
          lead="Sample SEO feed pages for layout review. Each example represents a different matrix pattern. Images are placeholders until programmatic generation is ready."
        />

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title="Preview examples"
              subhead="Open each page to critique hero, sections, capabilities, FAQ, and CTA placement."
              className="mb-10"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {previews.map((entry) => {
                const content = getFeedPageContent(entry);
                return (
                  <Link
                    key={entry.url}
                    href={entry.url}
                    className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
                        {PATTERN_LABELS[entry.pattern] ?? entry.pattern}
                      </span>
                      <span className="text-xs text-gray-500">{entry.layer}</span>
                    </div>
                    <h2 className="text-xl font-bold group-hover:text-blue-100">{content.h1}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-400">{content.lead}</p>
                    <p className="mt-4 font-mono text-xs text-gray-500">{entry.url}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-400">
                      Preview layout
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </PageShell>
    </ContentProvider>
  );
}

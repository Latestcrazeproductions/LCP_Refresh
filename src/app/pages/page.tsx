import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentProvider } from '@/context/ContentContext';
import { PageHero } from '@/components/layout/PageHero';
import { PageShell } from '@/components/layout/PageShell';
import { getSiteContent } from '@/lib/content';
import { flattenSitePages, getSitePageIndex } from '@/lib/site-pages';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'All pages',
  description: 'Index of every live page on Latest Craze Productions.',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/pages` },
};

export const revalidate = 3600;

export default async function PagesIndexPage() {
  const content = await getSiteContent();
  const groups = await getSitePageIndex();
  const allPages = flattenSitePages(groups);

  return (
    <ContentProvider content={content}>
      <PageShell>
      <PageHero
        eyebrow="Site index"
        title="All live pages"
        lead={`${allPages.length} URLs currently deployed on this environment. Bookmark this page to review production content without opening GitHub.`}
      />

      <div className="mx-auto max-w-4xl px-6 pb-24 pt-4">
        <p className="mb-10 text-sm text-white/50">
          Machine-readable sitemap:{' '}
          <Link href="/sitemap.xml" className="text-blue-400 hover:text-blue-300 hover:underline">
            /sitemap.xml
          </Link>
        </p>

        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.id}>
              <h2 className="mb-4 text-lg font-semibold text-white">{group.label}</h2>
              <ul className="divide-y divide-white/8 rounded-xl border border-white/10 bg-white/[0.02]">
                {group.pages.map((page) => (
                  <li key={page.path}>
                    <Link
                      href={page.path}
                      className="flex flex-col gap-1 px-5 py-4 transition hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="font-medium text-white">{page.title}</span>
                      <span className="font-mono text-sm text-blue-400/90">{page.path}</span>
                    </Link>
                    {page.lastModified ? (
                      <p className="px-5 pb-3 text-xs text-white/40">Updated {page.lastModified}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      </PageShell>
    </ContentProvider>
  );
}

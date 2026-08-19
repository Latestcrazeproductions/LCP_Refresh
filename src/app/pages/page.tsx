import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentProvider } from '@/context/ContentContext';
import { SeoContentShell } from '@/components/layout/SeoContentShell';
import { SeoPageHero } from '@/components/layout/SeoPageHero';
import { getSiteContent } from '@/lib/content';
import { flattenSitePages, getDemandEnginePageIndex } from '@/lib/site-pages';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'SEO Engine pages',
  description: 'Live pages published by the LCP inbound demand engine.',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/pages` },
};

export const revalidate = 3600;

export default async function PagesIndexPage() {
  const content = await getSiteContent();
  const groups = getDemandEnginePageIndex();
  const allPages = flattenSitePages(groups);

  return (
    <ContentProvider content={content}>
      <SeoContentShell>
        <SeoPageHero
          eyebrow="Inbound demand engine"
          title="SEO Engine pages"
          description={`${allPages.length} live ${allPages.length === 1 ? 'page' : 'pages'} published by the demand engine — hubs, blogs, case studies, and tools.`}
          imageLabel="Latest Craze Productions — SEO content index"
        />

        <div className="mx-auto max-w-4xl px-6 pb-24 pt-4">
          <p className="mb-10 text-sm text-slate-500">
            Full site sitemap:{' '}
            <Link
              href="/sitemap.xml"
              className="font-medium text-blue-700 underline-offset-4 hover:text-blue-800 hover:underline"
            >
              /sitemap.xml
            </Link>
          </p>

          {groups.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-slate-600 shadow-sm">
              No demand-engine pages are marked live in{' '}
              <code className="text-blue-700">content-registry/pages.jsonl</code> yet.
            </p>
          ) : (
            <div className="space-y-12">
              {groups.map((group) => (
                <section key={group.id}>
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">{group.label}</h2>
                  <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
                    {group.pages.map((page) => (
                      <li key={page.path}>
                        <Link
                          href={page.path}
                          className="flex flex-col gap-1 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="font-medium text-slate-900">{page.title}</span>
                          <span className="font-mono text-sm text-blue-700">{page.path}</span>
                        </Link>
                        {(page.lastModified || page.track) && (
                          <p className="px-5 pb-3 text-xs text-slate-500">
                            {[page.track ? `Track ${page.track}` : null, page.lastModified ? `Updated ${page.lastModified}` : null]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </SeoContentShell>
    </ContentProvider>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FeedLanding } from '@/components/layout/FeedLanding';
import { getFeedPageContent } from '@/content/feed-examples';
import { getSiteContent } from '@/lib/content';
import {
  FEED_ROUTABLE_PATHS,
  feedPathFromSlug,
  getFeedEntry,
  isFeedIndexable,
  isFeedRoutable,
  slugFromFeedPath,
} from '@/lib/feed-registry';
import { buildFAQSchema } from '@/lib/structured-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  return FEED_ROUTABLE_PATHS.map((path) => ({
    slug: slugFromFeedPath(path),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feedPath = feedPathFromSlug(slug);
  const entry = getFeedEntry(feedPath);
  if (!entry) return { title: 'Not Found' };

  const page = getFeedPageContent(entry);
  const indexable = isFeedIndexable(feedPath);
  return {
    title: page.h1,
    description: page.lead,
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: `${page.h1} | Latest Craze Productions`,
      description: page.lead,
      url: `${SITE_URL}${feedPath}`,
    },
    alternates: { canonical: `${SITE_URL}${feedPath}` },
  };
}

export default async function FeedPage({ params }: Props) {
  const { slug } = await params;
  const feedPath = feedPathFromSlug(slug);
  const entry = getFeedEntry(feedPath);

  if (!entry || !isFeedRoutable(feedPath)) {
    notFound();
  }

  const siteContent = await getSiteContent();
  const page = getFeedPageContent(entry);
  const faqSchema = page.faq.length > 0 ? buildFAQSchema(page.faq) : null;

  return (
    <>
      {faqSchema && isFeedIndexable(feedPath) ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
      <FeedLanding entry={entry} page={page} siteContent={siteContent} />
    </>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FeedLanding } from '@/components/layout/FeedLanding';
import { getFeedPageContent } from '@/content/feed-examples';
import { getSiteContent } from '@/lib/content';
import {
  FEED_PREVIEW_PATHS,
  feedPathFromSlug,
  getFeedEntry,
  slugFromFeedPath,
} from '@/lib/feed-registry';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  return FEED_PREVIEW_PATHS.map((path) => ({
    slug: slugFromFeedPath(path),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feedPath = feedPathFromSlug(slug);
  const entry = getFeedEntry(feedPath);
  if (!entry) return { title: 'Not Found' };

  const page = getFeedPageContent(entry);
  return {
    title: page.h1,
    description: page.lead,
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}${feedPath}` },
  };
}

export default async function FeedPage({ params }: Props) {
  const { slug } = await params;
  const feedPath = feedPathFromSlug(slug);
  const entry = getFeedEntry(feedPath);

  if (!entry || !FEED_PREVIEW_PATHS.includes(feedPath as (typeof FEED_PREVIEW_PATHS)[number])) {
    notFound();
  }

  const siteContent = await getSiteContent();
  const page = getFeedPageContent(entry);

  return <FeedLanding entry={entry} page={page} siteContent={siteContent} />;
}

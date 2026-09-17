import type { Metadata } from 'next';
import { ContentHubIndex } from '@/components/layout/ContentHubIndex';
import { DEFAULT_OG_IMAGE, SITE_URL, twitterLargeImageFields } from '@/lib/article-metadata';
import { getSiteContent } from '@/lib/content';

const title = 'Blog';
const description =
  'Event production insights for corporate planners and marketing teams — AV strategy, venue logistics, and show-day execution.';
const og = twitterLargeImageFields(
  'Blog | Latest Craze Productions',
  'Production insights for corporate events.',
  DEFAULT_OG_IMAGE.url
);

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    ...og.openGraph,
    url: `${SITE_URL}/blog`,
  },
  twitter: og.twitter,
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogIndexPage() {
  const content = await getSiteContent();
  return <ContentHubIndex section="blogs" content={content} />;
}

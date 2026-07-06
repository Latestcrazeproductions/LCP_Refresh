import type { Metadata } from 'next';
import { ContentHubIndex } from '@/components/layout/ContentHubIndex';
import { getSiteContent } from '@/lib/content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Event production insights for corporate planners and marketing teams — AV strategy, venue logistics, and show-day execution.',
  openGraph: {
    title: 'Blog | Latest Craze Productions',
    description: 'Production insights for corporate events.',
    url: `${SITE_URL}/blog`,
  },
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogIndexPage() {
  const content = await getSiteContent();
  return <ContentHubIndex section="blogs" content={content} />;
}

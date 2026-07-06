import type { Metadata } from 'next';
import { ContentHubIndex } from '@/components/layout/ContentHubIndex';
import { getSiteContent } from '@/lib/content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Event production planning resources and checklists for corporate conferences, galas, and general sessions.',
  openGraph: {
    title: 'Resources | Latest Craze Productions',
    description: 'Planning checklists and production frameworks.',
    url: `${SITE_URL}/resources`,
  },
  alternates: { canonical: `${SITE_URL}/resources` },
};

export default async function ResourcesIndexPage() {
  const content = await getSiteContent();
  return <ContentHubIndex section="resources" content={content} />;
}

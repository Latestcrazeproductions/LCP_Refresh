import type { Metadata } from 'next';
import { ContentHubIndex } from '@/components/layout/ContentHubIndex';
import { getSiteContent } from '@/lib/content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Case studies and event production work from Latest Craze Productions — galas, keynotes, and brand activations.',
  openGraph: {
    title: 'Case Studies | Latest Craze Productions',
    description: 'Production outcomes from corporate events nationwide.',
    url: `${SITE_URL}/work`,
  },
  alternates: { canonical: `${SITE_URL}/work` },
};

export default async function WorkIndexPage() {
  const content = await getSiteContent();
  return <ContentHubIndex section="work" content={content} />;
}

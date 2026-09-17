import type { Metadata } from 'next';
import { ContentHubIndex } from '@/components/layout/ContentHubIndex';
import { DEFAULT_OG_IMAGE, SITE_URL, twitterLargeImageFields } from '@/lib/article-metadata';
import { getSiteContent } from '@/lib/content';

const title = 'Case Studies';
const description =
  'Case studies and event production work from Latest Craze Productions — galas, keynotes, and brand activations.';
const og = twitterLargeImageFields(
  'Case Studies | Latest Craze Productions',
  'Production outcomes from corporate events nationwide.',
  DEFAULT_OG_IMAGE.url
);

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    ...og.openGraph,
    url: `${SITE_URL}/work`,
  },
  twitter: og.twitter,
  alternates: { canonical: `${SITE_URL}/work` },
};

export default async function WorkIndexPage() {
  const content = await getSiteContent();
  return <ContentHubIndex section="work" content={content} />;
}

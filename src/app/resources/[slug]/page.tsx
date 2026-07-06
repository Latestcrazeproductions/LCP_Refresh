import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentHubArticle } from '@/components/layout/ContentHubArticle';
import { getSiteContent } from '@/lib/content';
import { getMarkdownPage, listMarkdownSlugs } from '@/lib/markdown-pages';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listMarkdownSlugs('resources').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getMarkdownPage('resources', slug);
  if (!page) return { title: 'Not Found' };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${SITE_URL}/resources/${slug}` },
  };
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const page = getMarkdownPage('resources', slug);
  if (!page) notFound();
  const content = await getSiteContent();

  return (
    <ContentHubArticle
      page={page}
      content={content}
      backHref="/resources"
      backLabel="Resources"
      sectionKey="resources"
    />
  );
}

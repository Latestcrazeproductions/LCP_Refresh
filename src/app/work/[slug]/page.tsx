import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentHubArticle } from '@/components/layout/ContentHubArticle';
import { buildArticleMetadata } from '@/lib/article-metadata';
import { getSiteContent } from '@/lib/content';
import { getMarkdownPage, listMarkdownSlugs } from '@/lib/markdown-pages';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listMarkdownSlugs('work').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getMarkdownPage('work', slug);
  if (!page) return { title: 'Not Found' };
  return buildArticleMetadata(page, `/work/${slug}`);
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const page = getMarkdownPage('work', slug);
  if (!page) notFound();
  const content = await getSiteContent();

  return (
    <ContentHubArticle
      page={page}
      content={content}
      backHref="/work"
      backLabel="Case studies"
      sectionKey="work"
    />
  );
}

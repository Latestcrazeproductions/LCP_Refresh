import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactCta from '@/components/ContactCta';
import { getMarkdownPage, listMarkdownSlugs, markdownToHtml } from '@/lib/markdown-pages';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listMarkdownSlugs('blogs').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getMarkdownPage('blogs', slug);
  if (!page) return { title: 'Not Found' };
  return {
    title: `${page.title} | Latest Craze Productions`,
    description: page.description,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const page = getMarkdownPage('blogs', slug);
  if (!page) notFound();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/blog" className="text-sm text-white/50 hover:text-white mb-8 inline-block">
          ← Blog
        </Link>
        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(page.body) }}
        />
        <div className="mt-12">
          <ContactCta />
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ContentProvider } from '@/context/ContentContext';
import { getSiteContent } from '@/lib/content';
import { listMarkdownSlugs, getMarkdownPage } from '@/lib/markdown-pages';

export const metadata = {
  title: 'Blog | Latest Craze Productions',
  description: 'Event production insights for corporate planners and marketing teams.',
};

export default async function BlogIndexPage() {
  const content = await getSiteContent();
  const slugs = listMarkdownSlugs('blogs');

  return (
    <ContentProvider content={content}>
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <main className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-white/60 mb-10">Production insights for corporate events.</p>
          <ul className="space-y-4">
            {slugs.map((slug) => {
              const page = getMarkdownPage('blogs', slug);
              if (!page) return null;
              return (
                <li key={slug}>
                  <Link href={`/blog/${slug}`} className="text-blue-400 hover:underline text-lg">
                    {page.title}
                  </Link>
                  {page.description && (
                    <p className="text-white/50 text-sm mt-1">{page.description}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

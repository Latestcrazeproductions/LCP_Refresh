import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { listMarkdownSlugs, getMarkdownPage } from '@/lib/markdown-pages';

export const metadata = {
  title: 'Resources | Latest Craze Productions',
  description: 'Event production planning resources and checklists.',
};

export default function ResourcesIndexPage() {
  const slugs = listMarkdownSlugs('resources');

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Resources</h1>
        <ul className="space-y-4 mt-8">
          {slugs.map((slug) => {
            const page = getMarkdownPage('resources', slug);
            if (!page) return null;
            return (
              <li key={slug}>
                <Link href={`/resources/${slug}`} className="text-blue-400 hover:underline text-lg">
                  {page.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
      <Footer />
    </div>
  );
}

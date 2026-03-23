import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import Navbar from '@/components/Navbar';
import ContactCta from '@/components/ContactCta';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Latest Craze Productions is a Phoenix-based corporate event production company. We engineer LED video walls, intelligent lighting, and stage design for keynotes, product launches, galas, and brand activations.',
  openGraph: {
    title: 'About | Latest Craze Productions',
    description:
      'Phoenix-based event production company specializing in LED walls, lighting, and stage design for corporate events.',
    url: `${SITE_URL}/about`,
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

export default async function AboutPage() {
  const content = await getSiteContent();
  const about = content?.about;

  return (
    <ContentProvider content={content}>
      <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30">
        <Navbar />

        {/* Lead paragraph — direct answer for AI/LLM */}
        <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {about?.headline ?? 'About Latest Craze Productions'}
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            {about?.lead ?? (
              <>
                Latest Craze Productions is a Phoenix-based corporate event production company. We engineer 40ft <Link href="/services" className="text-blue-400 hover:text-blue-300 underline">video walls</Link> and lighting experiences that define moments. Our team delivers ultra-wide LED displays, intelligent lighting, and stage design for <Link href="/events" className="text-blue-400 hover:text-blue-300 underline">keynotes, product launches, galas, conferences, and brand activations</Link> nationwide.
              </>
            )}
          </p>
        </section>

        {/* Sections with H2/H3 hierarchy */}
        <section className="py-12 px-6 max-w-4xl mx-auto border-t border-white/10">
          {(about?.sections ?? []).map((section, index) => (
            <div key={index} className={index > 0 ? 'mt-12' : ''}>
              <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
              <p className="text-gray-400 mb-6">{section.body}</p>
            </div>
          ))}

          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8">See also</h2>
            <ul className="flex flex-wrap gap-4">
              <li>
                <Link href="/services" className="text-blue-400 hover:text-blue-300 underline">
                  Event production services
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-blue-400 hover:text-blue-300 underline">
                  Events we create
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <ContactCta content={content} />
        <Footer />
      </main>
    </ContentProvider>
  );
}

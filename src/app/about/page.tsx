import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import ContactCta from '@/components/ContactCta';
import { ImagePlaceholder } from '@/components/layout/ImagePlaceholder';
import { PageHero } from '@/components/layout/PageHero';
import { PageShell } from '@/components/layout/PageShell';
import { RelatedLinks } from '@/components/layout/RelatedLinks';
import { SectionHeader } from '@/components/layout/SectionHeader';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Latest Craze Productions is a Phoenix-based corporate event production company. We provide LED video walls, intelligent lighting, and stage design for keynotes, product launches, galas, and brand activations.',
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
  const sections = about?.sections ?? [];

  return (
    <ContentProvider content={content}>
      <PageShell>
        <PageHero
          eyebrow="About us"
          title={about?.headline ?? 'About Latest Craze Productions'}
          lead={
            about?.lead ??
            'Latest Craze Productions is a Phoenix-based corporate event production company. We provide LED video walls, intelligent lighting, and stage design for experiences that define moments.'
          }
        />

        <section className="px-6 pb-8">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-2xl border border-white/5">
              <ImagePlaceholder label="About hero — corporate event production team" aspect="wide" />
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title="Who we are"
              subhead="Full-service AV production for corporate experiences nationwide."
              className="mb-12"
            />
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {sections.map((section, index) => (
                <article
                  key={index}
                  className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                  <ImagePlaceholder label={section.title} aspect="wide" />
                  <div className="p-8">
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                    <p className="mt-4 leading-relaxed text-gray-400">{section.body}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-12 max-w-3xl text-lg leading-relaxed text-gray-300">
              Explore our{' '}
              <Link href="/services" className="text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline">
                event production services
              </Link>
              , see the{' '}
              <Link href="/events" className="text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline">
                events we create
              </Link>
              , and{' '}
              <Link href="/contact" className="text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline">
                contact us
              </Link>{' '}
              to discuss your next program.
            </p>
          </div>
        </section>

        <RelatedLinks
          links={[
            { href: '/services', label: 'Services' },
            { href: '/work', label: 'Case studies' },
            { href: '/blog', label: 'Blog' },
            { href: '/contact', label: 'Contact' },
          ]}
        />
        <ContactCta content={content} />
      </PageShell>
    </ContentProvider>
  );
}

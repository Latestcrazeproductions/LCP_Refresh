import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Work from '@/components/Work';
import Contact from '@/components/Contact';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexusav.com';

export default async function HomePage() {
  const content = await getSiteContent();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Latest Craze Productions',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'We engineer 40ft video walls and lighting experiences that define moments. Ultra-wide LED displays, intelligent lighting, and stage design for corporate events.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '101 Tech Plaza',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-012-3456',
      contactType: 'sales',
      email: 'production@nexusav.com',
      areaServed: 'US',
    },
    sameAs: [],
    aggregateRating: undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ContentProvider content={content}>
        <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30 bg-grid-pattern">
          <Navbar />
          <Hero />
          <Services />
          <Work />
          <Contact />
        </main>
      </ContentProvider>
    </>
  );
}

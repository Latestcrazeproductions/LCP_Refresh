import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import EventTypes from '@/components/EventTypes';
import FeaturedVideo from '@/components/FeaturedVideo';
import Work from '@/components/Work';
import FAQ from '@/components/FAQ';
import ContactCta from '@/components/ContactCta';
import Footer from '@/components/Footer';
import {
  buildOrganizationSchema,
  buildServiceSchemas,
  buildFAQSchema,
} from '@/lib/structured-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export default async function HomePage() {
  const content = await getSiteContent();

  const orgSchema = buildOrganizationSchema(SITE_URL);
  const services = Array.isArray(content?.services?.items)
    ? content.services.items
    : [];
  const serviceSchemas = buildServiceSchemas(SITE_URL, services);
  const faqItems = Array.isArray(content?.faq?.items) ? content.faq.items : [];
  const faqSchema = buildFAQSchema(faqItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgSchema),
        }}
      />
      {serviceSchemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': serviceSchemas,
            }),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ContentProvider content={content}>
        <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30 bg-grid-pattern">
          <Navbar />
          <Hero />
          <Services />
          <EventTypes />
          <FeaturedVideo />
          <Work />
          <FAQ items={faqItems} />
          <ContactCta content={content} />
          <Footer />
        </main>
      </ContentProvider>
    </>
  );
}

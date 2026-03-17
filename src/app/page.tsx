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

const FAQ_ITEMS = [
  {
    question: 'What types of events does Latest Craze Productions handle?',
    answer:
      'We specialize in corporate keynotes, product launches, galas and awards ceremonies, conferences, and brand activations. Our services include LED video walls, intelligent lighting, stage design, precision audio, scenic design, and projection mapping.',
  },
  {
    question: 'Where is Latest Craze Productions based?',
    answer:
      'We are based in Phoenix, Arizona, and serve corporate events across the United States. Our team travels to venues nationwide for high-profile productions.',
  },
  {
    question: 'What is the typical lead time for an event?',
    answer:
      'We recommend 4–8 weeks for standard corporate events. Large-scale productions with custom fabrication may require 8–12 weeks. Contact us as soon as your event is confirmed to secure availability.',
  },
  {
    question: 'Do you provide LED video wall rentals?',
    answer:
      'Yes. We offer ultra-wide LED walls (40ft+), fine pixel pitch displays for 4K/8K clarity, and custom configurations including curved and corner setups. All displays include full redundancy for mission-critical events.',
  },
  {
    question: 'How does Latest Craze Productions handle lighting design?',
    answer:
      'Our intelligent lighting systems include moving heads, pixel-mapped LED bars, wireless uplighting, timecode sync with video and audio, and atmospheric effects. We design lighting that creates emotion and guides audience attention.',
  },
  {
    question: 'What audio equipment do you use?',
    answer:
      'We deploy premium line-array systems from L-Acoustics and d&b, digital mixing consoles with redundancy, RF coordination for wireless mics, and immersive surround configurations. Every system is tuned for crystal-clear intelligibility.',
  },
];

export default async function HomePage() {
  const content = await getSiteContent();

  const orgSchema = buildOrganizationSchema(SITE_URL);
  const services = Array.isArray(content?.services?.items)
    ? content.services.items
    : [];
  const serviceSchemas = buildServiceSchemas(SITE_URL, services);
  const faqSchema = buildFAQSchema(FAQ_ITEMS);

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
          <EventTypes />
          <Services />
          <FeaturedVideo />
          <Work />
          <FAQ items={FAQ_ITEMS} />
          <section className="py-12 px-6 max-w-4xl mx-auto border-t border-white/5">
            <h2 className="text-xl font-semibold text-gray-400 mb-4">Explore</h2>
            <ul className="flex flex-wrap gap-4">
              <li><Link href="/services" className="text-blue-400 hover:text-blue-300 underline">Event production services</Link></li>
              <li><Link href="/events" className="text-blue-400 hover:text-blue-300 underline">Events we create</Link></li>
              <li><Link href="/about" className="text-blue-400 hover:text-blue-300 underline">About us</Link></li>
              <li><Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact</Link></li>
            </ul>
          </section>
          <ContactCta content={content} />
          <Footer />
        </main>
      </ContentProvider>
    </>
  );
}

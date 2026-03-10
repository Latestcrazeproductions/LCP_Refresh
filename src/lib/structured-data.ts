/**
 * Structured data (JSON-LD) for SEO and AI discoverability.
 * Schema must match visible page content (content parity).
 */

export type ServiceSchema = {
  '@type': 'Service';
  name: string;
  description: string;
  provider?: { '@id': string };
};

export type FAQSchema = {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
};

export function buildOrganizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: 'Latest Craze Productions',
    alternateName: 'Latest Craze',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      'Latest Craze Productions engineers 40ft video walls and lighting experiences that define moments. Ultra-wide LED displays, intelligent lighting, stage design, and precision audio for corporate events in Phoenix and nationwide.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4035 E Magnolia St',
      addressLocality: 'Phoenix',
      addressRegion: 'AZ',
      postalCode: '85034',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.4484,
      longitude: -112.074,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1 (480) 626-5231',
        contactType: 'sales',
        email: 'info@latestcrazeproductions.com',
        areaServed: 'US',
        availableLanguage: 'English',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'info@latestcrazeproductions.com',
        areaServed: 'US',
      },
    ],
    sameAs: [] as string[],
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 33.4484,
        longitude: -112.074,
      },
      geoRadius: '50000', // ~31 miles, extend as needed
    },
  };
}

export function buildServiceSchemas(
  siteUrl: string,
  services: Array<{ id: string; title: string; description: string }>
): ServiceSchema[] {
  const orgId = `${siteUrl}/#organization`;
  return services.map((s) => ({
    '@type': 'Service' as const,
    name: s.title,
    description: s.description,
    provider: { '@id': orgId },
  }));
}

export function buildFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): { '@context': string; '@type': string; mainEntity: FAQSchema[] } {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  };
}

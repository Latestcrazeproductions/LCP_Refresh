import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import ContactCta from '@/components/ContactCta';
import { ImagePlaceholder } from '@/components/layout/ImagePlaceholder';
import { SeoContentShell } from '@/components/layout/SeoContentShell';
import { SeoPageHero } from '@/components/layout/SeoPageHero';
import { RelatedLinks } from '@/components/layout/RelatedLinks';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { NATIONWIDE_HUB } from '@/content/nationwide-hub';
import { buildFAQSchema } from '@/lib/structured-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';
const PAGE_PATH = '/nationwide-event-production';

export const metadata: Metadata = {
  title: 'Nationwide Event Production',
  description:
    'Corporate event production across the United States — one technical standard, touring crews, and show operation from Latest Craze Productions. Phoenix HQ, nationwide deployment.',
  openGraph: {
    title: 'Nationwide Event Production | Latest Craze Productions',
    description:
      'Nationwide corporate event production — LED, lighting, audio, staging, and show operation with one technical standard in every market.',
    url: `${SITE_URL}${PAGE_PATH}`,
  },
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
};

export default async function NationwideEventProductionPage() {
  const content = await getSiteContent();
  const page = NATIONWIDE_HUB;
  const faqSchema = buildFAQSchema(page.faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ContentProvider content={content}>
        <SeoContentShell>
          <SeoPageHero
            eyebrow={page.eyebrow}
            title={page.h1}
            description={page.lead}
            imageLabel="Nationwide touring production — LED and staging"
          >
            <Link
              href={page.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700"
            >
              {page.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-gray-300 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              View capabilities
            </Link>
          </SeoPageHero>

          <section className="border-t border-slate-200 px-6 py-16">
            <div className="mx-auto max-w-3xl">
              <p className="text-lg leading-relaxed text-slate-700">{page.intro}</p>
              <p className="mt-4 leading-relaxed text-slate-600">
                Latest Craze Productions is headquartered in Phoenix with warehouse prep, QC, and
                show-ready inventory. We deploy nationwide for keynotes, conferences, galas, product
                launches, and multi-city programs where brand moments cannot reset between markets.
              </p>
            </div>
          </section>

          <section className="px-6 py-12">
            <div className="mx-auto max-w-7xl space-y-20">
              {page.sections.map((section, index) => (
                <div
                  key={section.title}
                  className={`grid grid-cols-1 items-start gap-10 lg:grid-cols-2 ${
                    index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{section.title}</h2>
                    <p className="mt-4 text-lg leading-relaxed text-slate-600">{section.body}</p>
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-6 space-y-3">
                        {section.bullets.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.numbered && section.numbered.length > 0 && (
                      <ol className="mt-6 list-none space-y-3">
                        {section.numbered.map((item, i) => (
                          <li key={item} className="flex items-start gap-3 text-slate-700">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                              {i + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <ImagePlaceholder
                      label={section.title}
                      aspect="wide"
                      variant="light"
                      className="min-h-[280px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-slate-200 px-6 py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{page.floorStory.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{page.floorStory.body}</p>
            </div>
          </section>

          <section className="border-t border-slate-200 px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <SectionHeader
                title={page.capabilitiesTitle}
                subhead="Integrated production — not piecemeal AV rental."
                className="mb-12"
                variant="light"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {page.capabilities.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-800 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 px-6 py-20">
            <div className="mx-auto max-w-3xl">
              <SectionHeader title="Common questions" className="mb-10" variant="light" />
              <dl className="space-y-8">
                {page.faq.map((item) => (
                  <div key={item.question}>
                    <dt className="text-lg font-semibold text-slate-900">{item.question}</dt>
                    <dd className="mt-2 leading-relaxed text-slate-600">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <RelatedLinks links={page.relatedLinks} title="Related pages" variant="light" />

          <section className="border-t border-slate-200 bg-white px-6 py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Plan your next market</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Share your dates, markets, and run-of-show — we will scope touring production against
                your technical standard.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <ContactCta content={content} />
        </SeoContentShell>
      </ContentProvider>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import ContactCta from '@/components/ContactCta';
import { ImagePlaceholder } from '@/components/layout/ImagePlaceholder';
import { PageShell } from '@/components/layout/PageShell';
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
        <PageShell>
          {/* Hero — primary CTA above fold */}
          <section className="relative pt-24">
            <div className="relative h-[50vh] min-h-[360px] max-h-[560px] w-full">
              <ImagePlaceholder
                label="Nationwide touring production — LED and staging"
                aspect="hero"
                fill
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-[#050505]/20" />
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                <div className="mx-auto max-w-7xl">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                    {page.eyebrow}
                  </p>
                  <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                    {page.h1}
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-300">{page.lead}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href={page.primaryCta.href}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-500"
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
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Direct intro */}
          <section className="border-t border-white/10 px-6 py-16">
            <div className="mx-auto max-w-3xl">
              <p className="text-lg leading-relaxed text-gray-300">{page.intro}</p>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Latest Craze Productions is headquartered in Phoenix with warehouse prep, QC, and
                show-ready inventory. We deploy nationwide for keynotes, conferences, galas, product
                launches, and multi-city programs where brand moments cannot reset between markets.
              </p>
            </div>
          </section>

          {/* Body sections — alternating text + image placeholder */}
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
                    <h2 className="text-2xl font-bold md:text-3xl">{section.title}</h2>
                    <p className="mt-4 text-lg leading-relaxed text-gray-300">{section.body}</p>
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-6 space-y-3">
                        {section.bullets.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-gray-300">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.numbered && section.numbered.length > 0 && (
                      <ol className="mt-6 space-y-3 list-none">
                        {section.numbered.map((item, i) => (
                          <li key={item} className="flex items-start gap-3 text-gray-300">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xs font-semibold text-blue-400">
                              {i + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-white/5">
                    <ImagePlaceholder label={section.title} aspect="wide" className="min-h-[280px]" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* From the floor — story beat at end */}
          <section className="border-t border-white/10 px-6 py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold md:text-3xl">{page.floorStory.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-300">{page.floorStory.body}</p>
            </div>
          </section>

          {/* Capabilities grid */}
          <section className="border-t border-white/10 px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <SectionHeader
                title={page.capabilitiesTitle}
                subhead="Integrated production — not piecemeal AV rental."
                className="mb-12"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {page.capabilities.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-5 text-gray-200 transition-colors hover:border-blue-500/30 hover:bg-white/[0.05]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="border-t border-white/10 px-6 py-20">
            <div className="mx-auto max-w-3xl">
              <SectionHeader title="Common questions" className="mb-10" />
              <dl className="space-y-8">
                {page.faq.map((item) => (
                  <div key={item.question}>
                    <dt className="text-lg font-semibold text-white">{item.question}</dt>
                    <dd className="mt-2 leading-relaxed text-gray-400">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <RelatedLinks links={page.relatedLinks} title="Related pages" />

          {/* Bottom CTA */}
          <section className="border-t border-white/10 px-6 py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold md:text-3xl">Plan your next market</h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Share your dates, markets, and run-of-show — we will scope touring production against
                your technical standard.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <ContactCta content={content} />
        </PageShell>
      </ContentProvider>
    </>
  );
}

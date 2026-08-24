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
import { FEATURED_VENUES_HUB } from '@/content/featured-venues-hub';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';
const PAGE_PATH = '/featured-venues';

export const metadata: Metadata = {
  title: 'Featured Venues: Corporate Event Production Guide',
  description:
    'Venue production guide for corporate planners — hotel ballrooms, convention centers, resorts, and unique spaces. Site visit checklists, AV scaling, and what to send your production vendor.',
  openGraph: {
    title: 'Featured Venues | Latest Craze Productions',
    description:
      'Corporate event production at premier venues — LED walls, lighting, staging, and show operation scaled to the room.',
    url: `${SITE_URL}${PAGE_PATH}`,
  },
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
};

export default async function FeaturedVenuesPage() {
  const content = await getSiteContent();
  const page = FEATURED_VENUES_HUB;

  return (
    <ContentProvider content={content}>
      <SeoContentShell>
        <SeoPageHero
          eyebrow={page.eyebrow}
          title={page.h1}
          description={page.lead}
          imageLabel="Corporate venue production — LED and ballroom staging"
          size="hub"
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
            View production services
          </Link>
        </SeoPageHero>

        <section className="border-t border-slate-200 px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-slate-700">{page.intro}</p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Latest Craze Productions partners with hotels, convention centers, and unique spaces
              across the country — from intimate boardrooms to 40-foot LED canvases in the main
              ballroom. Share your venue and date; we align technical design with house rules,
              load-in schedules, and your creative goals.
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
            <p className="mt-6 leading-relaxed text-slate-600">
              For{' '}
              <Link href="/services/conferences" className="text-blue-700 hover:text-blue-800 underline">
                conference production
              </Link>
              ,{' '}
              <Link href="/services/led-walls" className="text-blue-700 hover:text-blue-800 underline">
                LED and IMAG
              </Link>
              , and full show-day support at your venue,{' '}
              <Link href="/contact" className="text-blue-700 hover:text-blue-800 underline">
                request a consultation
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="border-t border-slate-200 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title={page.capabilitiesTitle}
              subhead="Integrated production scaled to your venue — not piecemeal AV rental."
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

        <RelatedLinks links={page.relatedLinks} title="Related pages" variant="light" />

        <section className="border-t border-slate-200 bg-white px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Tell us your venue and date</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Send the floor plan, load-in window, and format — we will scope production against house
              rules and your run-of-show.
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
  );
}

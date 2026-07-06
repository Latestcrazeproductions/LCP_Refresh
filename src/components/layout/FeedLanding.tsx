import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ContactCta from '@/components/ContactCta';
import type { FeedPageContent } from '@/content/feed-examples';
import type { SiteContent } from '@/lib/content';
import type { FeedRegistryEntry } from '@/lib/feed-registry';
import { ContentProvider } from '@/context/ContentContext';
import { ImagePlaceholder } from './ImagePlaceholder';
import { PageShell } from './PageShell';
import { RelatedLinks } from './RelatedLinks';
import { SectionHeader } from './SectionHeader';

interface FeedLandingProps {
  entry: FeedRegistryEntry;
  page: FeedPageContent;
  siteContent: SiteContent;
}

export function FeedLanding({ entry, page, siteContent }: FeedLandingProps) {
  const isGeo = entry.layer === 'geo';

  return (
    <ContentProvider content={siteContent}>
      <PageShell>
        {/* Hero */}
        <section className="relative pt-24">
          <div className="relative h-[50vh] min-h-[360px] max-h-[560px] w-full">
            <ImagePlaceholder label={page.h1} aspect="hero" fill />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-[#050505]/20" />
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
              <div className="mx-auto max-w-7xl">
                <nav className="mb-3 text-sm text-gray-400">
                  <Link href="/feeds" className="transition-colors hover:text-white">
                    Feed previews
                  </Link>
                  <span className="mx-2">/</span>
                  <span className="text-white">{entry.pattern}</span>
                </nav>
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

        {/* Content sections — alternating text + image placeholder */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl space-y-20">
            {page.sections.map((section, index) => (
              <div
                key={section.title}
                className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${
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
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/5">
                  <ImagePlaceholder
                    label={section.imageLabel ?? section.title}
                    aspect="wide"
                    className="min-h-[280px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities grid */}
        <section className="border-t border-white/10 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title={page.capabilitiesTitle}
              subhead={
                isGeo
                  ? 'Local crews, national technical standards.'
                  : 'Integrated production — not piecemeal AV rental.'
              }
              className="mb-12"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.capabilities.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-5 text-gray-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {page.faq.length > 0 && (
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
        )}

        <RelatedLinks links={page.relatedLinks} title="Related pages" />
        <ContactCta content={siteContent} />
      </PageShell>
    </ContentProvider>
  );
}

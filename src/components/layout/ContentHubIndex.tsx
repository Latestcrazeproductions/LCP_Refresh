import ContactCta from '@/components/ContactCta';
import { ContentIndexCard } from '@/components/layout/ContentIndexCard';
import { PageHero } from '@/components/layout/PageHero';
import { PageShell } from '@/components/layout/PageShell';
import { RelatedLinks } from '@/components/layout/RelatedLinks';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ImagePlaceholder } from '@/components/layout/ImagePlaceholder';
import { ContentProvider } from '@/context/ContentContext';
import {
  CONTENT_HUBS,
  formatContentDate,
  getTrackLabel,
} from '@/lib/content-hubs';
import type { SiteContent } from '@/lib/content';
import { listMarkdownPages, type ContentSection } from '@/lib/markdown-pages';

interface ContentHubIndexProps {
  section: ContentSection;
  content: SiteContent;
}

export function ContentHubIndex({ section, content }: ContentHubIndexProps) {
  const hub = CONTENT_HUBS[section];
  const pages = listMarkdownPages(section);
  const basePaths = { blogs: '/blog', work: '/work', resources: '/resources' } as const;
  const basePath = basePaths[section];

  return (
    <ContentProvider content={content}>
      <PageShell>
        <PageHero
          eyebrow={hub.eyebrow}
          title={hub.title}
          lead={hub.lead}
        />

        <section className="px-6 pb-8">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-2xl border border-white/5">
              <ImagePlaceholder label={hub.imageLabel} aspect="wide" />
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <SectionHeader title={hub.sectionTitle} subhead={hub.sectionSubhead} className="mb-10" />
            {pages.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                  <ContentIndexCard
                    key={page.slug}
                    href={`${basePath}/${page.slug}`}
                    title={page.title}
                    description={page.description}
                    eyebrow={getTrackLabel(page.track)}
                    date={formatContentDate(page.dateModified)}
                    imageLabel={page.title}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">New content coming soon.</p>
            )}
          </div>
        </section>

        <RelatedLinks links={hub.relatedLinks} />
        <ContactCta content={content} />
      </PageShell>
    </ContentProvider>
  );
}

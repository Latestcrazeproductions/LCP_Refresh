import ContactCta from '@/components/ContactCta';
import { ContentIndexCard } from '@/components/layout/ContentIndexCard';
import { SeoContentShell } from '@/components/layout/SeoContentShell';
import { SeoPageHero } from '@/components/layout/SeoPageHero';
import { RelatedLinks } from '@/components/layout/RelatedLinks';
import { SectionHeader } from '@/components/layout/SectionHeader';
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
      <SeoContentShell>
        <SeoPageHero
          eyebrow={hub.eyebrow}
          title={hub.title}
          description={hub.lead}
          imageLabel={hub.imageLabel}
          size="index"
        />

        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title={hub.sectionTitle}
              subhead={hub.sectionSubhead}
              className="mb-10"
              variant="light"
            />
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
                    variant="light"
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-600">New content coming soon.</p>
            )}
          </div>
        </section>

        <RelatedLinks links={hub.relatedLinks} variant="light" />
        <ContactCta content={content} />
      </SeoContentShell>
    </ContentProvider>
  );
}

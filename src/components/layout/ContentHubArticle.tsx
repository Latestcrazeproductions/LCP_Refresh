import ContactCta from '@/components/ContactCta';
import { ArticleLayout } from '@/components/layout/ArticleLayout';
import { PageShell } from '@/components/layout/PageShell';
import { RelatedLinks } from '@/components/layout/RelatedLinks';
import { ContentProvider } from '@/context/ContentContext';
import {
  CONTENT_HUBS,
  formatContentDate,
  getTrackLabel,
} from '@/lib/content-hubs';
import type { SiteContent } from '@/lib/content';
import { markdownToHtml, type MarkdownPage } from '@/lib/markdown-pages';

interface ContentHubArticleProps {
  page: MarkdownPage;
  content: SiteContent;
  backHref: string;
  backLabel: string;
  sectionKey: 'blogs' | 'work' | 'resources';
}

export function ContentHubArticle({
  page,
  content,
  backHref,
  backLabel,
  sectionKey,
}: ContentHubArticleProps) {
  const hub = CONTENT_HUBS[sectionKey];

  return (
    <ContentProvider content={content}>
      <PageShell>
        <ArticleLayout
          title={page.title}
          description={page.description}
          eyebrow={page.eyebrow ?? getTrackLabel(page.track)}
          date={formatContentDate(page.dateModified)}
          backHref={backHref}
          backLabel={backLabel}
          imageLabel={page.title}
          footer={
            <>
              <RelatedLinks links={hub.relatedLinks} />
              <ContactCta content={content} />
            </>
          }
        >
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(page.body) }} />
        </ArticleLayout>
      </PageShell>
    </ContentProvider>
  );
}

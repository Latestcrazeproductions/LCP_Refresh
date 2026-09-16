import ContactCta from '@/components/ContactCta';
import { ShareButton } from '@/components/ShareButton';
import { ArticleLayout } from '@/components/layout/ArticleLayout';
import { SeoContentShell } from '@/components/layout/SeoContentShell';
import { RelatedLinks } from '@/components/layout/RelatedLinks';
import { ContentProvider } from '@/context/ContentContext';
import { SITE_URL, resolveMarkdownShareImage } from '@/lib/article-metadata';
import { CONTENT_HUBS, formatContentDate } from '@/lib/content-hubs';
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
  const shareUrl = `${SITE_URL}${backHref}/${page.slug}`;
  const shareImage = resolveMarkdownShareImage(page);

  return (
    <ContentProvider content={content}>
      <SeoContentShell>
        <ArticleLayout
          title={page.title}
          description={page.description}
          eyebrow={page.eyebrow}
          date={formatContentDate(page.dateModified)}
          backHref={backHref}
          backLabel={backLabel}
          imageLabel={page.title}
          images={shareImage.isItemImage ? [{ src: shareImage.src, alt: shareImage.alt }] : undefined}
          share={<ShareButton title={page.title} text={page.description} url={shareUrl} />}
          footer={
            <>
              <RelatedLinks links={hub.relatedLinks} variant="light" />
              <ContactCta content={content} />
            </>
          }
        >
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(page.body, 'light') }} />
        </ArticleLayout>
      </SeoContentShell>
    </ContentProvider>
  );
}

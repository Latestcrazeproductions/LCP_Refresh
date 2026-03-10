import type { MetadataRoute } from 'next';
import { getSiteContent } from '@/lib/content';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const content = await getSiteContent();
  const eventItems = content?.eventTypes?.items ?? [];
  const eventUrls = eventItems.map((item) => ({
    url: `${baseUrl}/events/${item.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const serviceItems = content?.services?.items ?? [];
  const serviceUrls = serviceItems.map((item) => ({
    url: `${baseUrl}/services/${item.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/events`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.5 },
    ...eventUrls,
    ...serviceUrls,
  ];
}

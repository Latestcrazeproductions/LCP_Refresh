import type { ContentSection } from './markdown-pages';

export interface ContentHubConfig {
  eyebrow: string;
  title: string;
  lead: string;
  sectionTitle: string;
  sectionSubhead: string;
  imageLabel: string;
  relatedLinks: { href: string; label: string }[];
}

export const CONTENT_HUBS: Record<ContentSection, ContentHubConfig> = {
  blogs: {
    eyebrow: 'Insights',
    title: 'Event Production Blog',
    lead: 'Practical guidance for corporate planners, marketing teams, and production partners — AV strategy, venue logistics, and show-day execution.',
    sectionTitle: 'Latest articles',
    sectionSubhead: 'Production insights written for decision-makers.',
    imageLabel: 'Blog hero — event production insights',
    relatedLinks: [
      { href: '/services', label: 'Services' },
      { href: '/work', label: 'Case studies' },
      { href: '/resources', label: 'Resources' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  work: {
    eyebrow: 'Portfolio',
    title: 'Case Studies',
    lead: 'Real events, real constraints — how Latest Craze Productions delivers premium AV, staging, and show management for corporate experiences.',
    sectionTitle: 'Featured work',
    sectionSubhead: 'Production outcomes from galas, keynotes, and brand activations.',
    imageLabel: 'Case study hero — corporate event production',
    relatedLinks: [
      { href: '/services', label: 'Services' },
      { href: '/blog', label: 'Blog' },
      { href: '/events', label: 'Events we create' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  resources: {
    eyebrow: 'Planning tools',
    title: 'Production Resources',
    lead: 'Checklists, timelines, and planning frameworks to help your team scope AV, staging, and rehearsal needs before show day.',
    sectionTitle: 'Available resources',
    sectionSubhead: 'Downloadable guides for corporate event production.',
    imageLabel: 'Resource hero — event planning checklist',
    relatedLinks: [
      { href: '/services', label: 'Services' },
      { href: '/blog', label: 'Blog' },
      { href: '/work', label: 'Case studies' },
      { href: '/contact', label: 'Contact' },
    ],
  },
};

export function formatContentDate(date?: string): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

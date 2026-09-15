import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import Navbar, { type NavbarLinkItem } from '@/components/Navbar';
import ParallaxBackdrop from '@/components/ParallaxBackdrop';
import ContactCta from '@/components/ContactCta';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

const PAGE_PATH = '/phoenix-av-production';

/** Featured production — automotive reveal with wide-format LED and stage lighting */
const PHOENIX_HERO_SRC = '/phoenix-av-production-hero.png';

const phoenixHeroAlt =
  'Corporate reveal event featuring a premium vehicle with wide-format LED display and theatrical lighting.';

/** Fixed top bar — routes that matter on this landing (matches site link tone) */
const PHOENIX_NAV_LINKS: NavbarLinkItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Events', href: '/events' },
  { label: 'Venues', href: '/featured-venues' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/** In-hero shortcuts — glass / border language from the rest of the site */
const heroNavLinks: { label: string; href: string }[] = [
  { label: 'Services', href: '/services' },
  { label: 'Events', href: '/events' },
  { label: 'Venues', href: '/featured-venues' },
  { label: 'Digital signage', href: '/digital-signage' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const metadata: Metadata = {
  title: 'Corporate Event Production in Phoenix',
  description:
    'Corporate event production in Phoenix — LED walls, lighting, audio, and staging from Latest Craze Productions. Warehouse at 4035 E Magnolia St. Valley shows and nationwide crews.',
  openGraph: {
    title: 'Corporate Event Production in Phoenix | Latest Craze Productions',
    description:
      'Corporate event production in Phoenix — LED, lighting, audio, and staging from a Phoenix warehouse, with crews that travel.',
    url: `${SITE_URL}${PAGE_PATH}`,
    images: [
      {
        url: `${SITE_URL}${PHOENIX_HERO_SRC}`,
        width: 1024,
        height: 682,
        alt: phoenixHeroAlt,
      },
    ],
  },
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
};

export default async function PhoenixAvProductionPage() {
  const content = await getSiteContent();

  const pillClass =
    'inline-flex items-center justify-center rounded-xl border border-white/15 bg-black/45 backdrop-blur-md px-5 py-3 text-[11px] font-display font-semibold uppercase tracking-[0.2em] text-gray-200 transition-all hover:border-blue-500/60 hover:bg-blue-600/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';

  return (
    <ContentProvider content={content}>
      <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30">
        <Navbar forceSolidBackground linkSet={PHOENIX_NAV_LINKS} />

        {/* Full viewport: featured production imagery + tagline + in-hero nav */}
        <header className="relative min-h-svh w-full flex flex-col overflow-hidden">
          <ParallaxBackdrop
            src={PHOENIX_HERO_SRC}
            alt={phoenixHeroAlt}
            intensity={0.32}
          />
          <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/55" />
          </div>

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-16 md:pt-28 md:pb-20 text-center max-w-4xl mx-auto w-full">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-5 drop-shadow-lg">
              Corporate event production in Phoenix
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl drop-shadow-md mb-12 md:mb-14">
              LED walls, lighting, audio, and staging from our Phoenix warehouse — Valley venues and
              nationwide crews from one technical standard.{' '}
              <span className="text-gray-300">4035 E Magnolia St, Phoenix, AZ 85034</span>
            </p>

            <nav aria-label="Explore Latest Craze" className="w-full max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-4 font-semibold">
                Where to next
              </p>
              <ul className="flex flex-wrap justify-center gap-3 md:gap-4">
                {heroNavLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={pillClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <article className="px-6 py-16 max-w-4xl mx-auto border-t border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Phoenix warehouse, Valley load-ins</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Latest Craze Productions is the local crew for corporate event production in Phoenix:
            keynotes, conferences, galas, and launches with LED video walls, lighting, precision
            audio, stage design, and show operation. Shows get prepped at 4035 E Magnolia St, then
            loaded into hotel ballrooms, resorts, and the convention center — or they travel with
            the same standard{' '}
            <Link href="/nationwide-event-production" className="text-blue-400 hover:text-blue-300 underline">
              nationwide
            </Link>
            .
          </p>
          <p className="text-gray-400 leading-relaxed mb-8">
            See{' '}
            <Link href="/services" className="text-blue-400 hover:text-blue-300 underline">
              full services
            </Link>
            ,{' '}
            <Link href="/featured-venues" className="text-blue-400 hover:text-blue-300 underline">
              venue production
            </Link>
            , or{' '}
            <Link href="/blog/phoenix-hybrid-event-production-guide" className="text-blue-400 hover:text-blue-300 underline">
              hybrid production in Phoenix
            </Link>
            . Send dates and venue to{' '}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">
              request a quote
            </Link>
            .
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Request a Phoenix production quote
          </Link>
        </article>

        <ContactCta content={content} />
        <Footer />
      </main>
    </ContentProvider>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export type NavbarLinkItem = { label: string; href: string };

type NavbarProps = {
  /** Use on image-heavy heroes so the bar stays readable without scrolling */
  forceSolidBackground?: boolean;
  /** Overrides default anchor links — use for landing pages where home sections are irrelevant */
  linkSet?: NavbarLinkItem[];
};

const DEFAULT_DESKTOP_LINKS: NavbarLinkItem[] = [
  { label: 'Expertise', href: '/#expertise' },
  { label: 'Events', href: '/#events' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '#contact' },
];

const DEFAULT_MOBILE_LINKS: NavbarLinkItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Events', href: '/events' },
  { label: 'Expertise', href: '/#expertise' },
  { label: 'Work', href: '/#work' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ forceSolidBackground = false, linkSet }: NavbarProps) {
  const { brand } = useContent();
  const safeBrand = brand ?? {
    name: 'Latest Craze',
    nameFull: 'Latest Craze Productions',
    logo: null as string | null,
    logoDark: null as string | null,
    logoHeight: 64,
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showSolidBg = forceSolidBackground || isScrolled;
  const navBackground = showSolidBg
    ? 'bg-black/85 backdrop-blur-md border-b border-white/10'
    : 'bg-transparent';

  const desktopLinks = linkSet ?? DEFAULT_DESKTOP_LINKS;
  const mobileLinks = linkSet
    ? [{ label: 'Home', href: '/' }, ...linkSet]
    : DEFAULT_MOBILE_LINKS;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBackground}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          {safeBrand.logo ? (
            <Image
              src={safeBrand.logo}
              alt={safeBrand.nameFull}
              width={(safeBrand.logoHeight ?? 64) * 3.5}
              height={safeBrand.logoHeight ?? 64}
              className="w-auto object-contain"
              style={{ height: `${safeBrand.logoHeight ?? 64}px` }}
              priority
            />
          ) : (
            <span className="text-2xl font-bold tracking-tighter font-display">
              {safeBrand.name.toUpperCase()}
              <span className="text-blue-500">.</span>
            </span>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          {desktopLinks.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              className="text-xs uppercase tracking-wider text-gray-300 hover:text-white transition-colors drop-shadow-md"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden absolute top-14 left-0 w-full bg-black border-b border-white/10 p-4 flex flex-col gap-4"
        >
          {mobileLinks.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              className="text-sm font-display text-gray-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

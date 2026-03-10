'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export default function Footer() {
  const { brand, contact } = useContent();
  const safeBrand = brand ?? {
    name: 'Latest Craze',
    nameFull: 'Latest Craze Productions',
  };
  const defaultFooterLinks = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Instagram', href: 'https://www.instagram.com/latestcrazeproductions/?hl=en' },
  ];
  const hrefOverrides: Record<string, string> = {
    Privacy: '/privacy',
    Terms: '/terms',
    Instagram: 'https://www.instagram.com/latestcrazeproductions/?hl=en',
  };
  const rawLinks = Array.isArray(contact?.footerLinks) && contact.footerLinks.length > 0
    ? contact.footerLinks
    : defaultFooterLinks;
  const footerLinks = rawLinks.map((link) => ({
    ...link,
    href: hrefOverrides[link.label] ?? link.href,
  }));
  const safeContact = {
    email: contact?.email ?? 'info@latestcrazeproductions.com',
    phone: contact?.phone ?? '+1 (480) 626-5231',
    address: contact?.address ?? '4035 E Magnolia St Phoenix, AZ 85034',
    copyright: contact?.copyright ?? '© 2025 Latest Craze Productions. All rights reserved.',
    footerLinks,
  };

  return (
    <footer
      className="bg-black border-t border-white/10 text-white"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Company & contact — NAP for local SEO */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {safeBrand.nameFull}
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Corporate event production in Phoenix. LED video walls, intelligent lighting, stage design, and precision audio for keynotes, product launches, galas, and brand activations.
            </p>
            <address className="not-italic space-y-2 text-sm text-gray-400">
              <a
                href={`mailto:${safeContact.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>{safeContact.email}</span>
              </a>
              <a
                href={`tel:${(safeContact.phone ?? '').replace(/\D/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{safeContact.phone}</span>
              </a>
              <span className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{safeContact.address}</span>
              </span>
            </address>
          </div>

          {/* Navigate — internal links with descriptive text */}
          <nav aria-label="Footer navigation">
            <h3 className="text-lg font-semibold mb-4">Navigate</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm">Event Production Services</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors text-sm">Events We Create</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/#expertise" className="text-gray-400 hover:text-white transition-colors text-sm">Expertise</Link></li>
              <li><Link href="/#faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </nav>

          {/* Services — keyword-rich links */}
          <nav aria-label="Services">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm">LED Video Wall Rental Phoenix</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm">Corporate Event Lighting Design</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm">Stage Design & Fabrication</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm">Event Audio Production</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm">Projection Mapping</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm">Scenic Design Phoenix</Link></li>
            </ul>
          </nav>

          {/* Events — keyword-rich links */}
          <nav aria-label="Event types">
            <h3 className="text-lg font-semibold mb-4">Event Types</h3>
            <ul className="space-y-2">
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors text-sm">Corporate Keynotes Phoenix</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors text-sm">Product Launches</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors text-sm">Galas & Awards</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors text-sm">Conferences</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors text-sm">Brand Activations</Link></li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">{safeContact.copyright}</p>
          <nav aria-label="Legal and social">
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <Link
                  href="/cms/login"
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  Log in
                </Link>
              </li>
              {safeContact.footerLinks.map((link) => {
                const isExternal = link.href.startsWith('http');
                return (
                  <li key={link.label}>
                    {isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    document.cookie = 'lcp_consent=; path=/; max-age=0';
                    window.location.reload();
                  }}
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  Cookie preferences
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

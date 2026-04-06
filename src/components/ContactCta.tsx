import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import type { SiteContent } from '@/lib/content';
import { getImageSrc, resolveSeoImage, type SeoImageInput } from '@/lib/seo-image';

const CONTACT_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop';

type ContactCtaProps = {
  content: SiteContent;
};

export default function ContactCta({ content }: ContactCtaProps) {
  const contact = content.contact;
  const contactPic = contact?.image;
  const hero0 = content.hero?.images?.[0];
  const projectImg = content.work?.projects?.[0]?.image;
  let sideImageRef: SeoImageInput = CONTACT_IMAGE_FALLBACK;
  if (getImageSrc(contactPic as SeoImageInput)) {
    sideImageRef = contactPic as SeoImageInput;
  } else if (getImageSrc(hero0 as SeoImageInput)) {
    sideImageRef = hero0 as SeoImageInput;
  } else if (projectImg) {
    sideImageRef = projectImg;
  }
  const sideVisual = resolveSeoImage(
    sideImageRef,
    `${content.brand?.nameFull ?? 'Latest Craze Productions'} — corporate event production contact`
  );

  const safeContact = {
    headline: contact?.headline ?? "LET'S MAKE YOU\nTHE HERO.",
    subhead: contact?.subhead ?? "We're here to help.",
    email: contact?.email ?? 'info@latestcrazeproductions.com',
    phone: contact?.phone ?? '+1 (480) 626-5231',
    address: contact?.address ?? '4035 E Magnolia St Phoenix, AZ 85034',
    ctaText: contact?.ctaText ?? 'Contact Us',
  };

  return (
    <section id="contact" className="py-24 bg-black text-white relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
              {safeContact.headline.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-md">{safeContact.subhead}</p>

            <div className="space-y-5">
              <a href={`mailto:${safeContact.email}`} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10">
                  <Mail className="w-5 h-5" />
                </div>
                <span>{safeContact.email}</span>
              </a>
              <a href={`tel:${safeContact.phone.replace(/\D/g, '')}`} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10">
                  <Phone className="w-5 h-5" />
                </div>
                <span>{safeContact.phone}</span>
              </a>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="p-3 rounded-full bg-white/5">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>{safeContact.address}</span>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                {safeContact.ctaText}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10">
            <Image
              src={sideVisual.src}
              alt={sideVisual.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

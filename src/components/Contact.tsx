'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { getOptimizedImageUrl } from '@/lib/image-utils';

const CONTACT_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop';

const EVENT_TYPES = [
  'Corporate Keynote',
  'Product Launch',
  'Gala / Awards Ceremony',
  'Conference',
  'Brand Activation',
  'Trade Show',
  'Other',
] as const;

const TIMELINE_OPTIONS = [
  'Within 4 weeks',
  '4–8 weeks',
  '8–12 weeks',
  '12+ weeks',
  'Flexible',
] as const;

const REFERRAL_OPTIONS = [
  'Search / Google',
  'Referral',
  'Social Media',
  'Past Client',
  'Event Industry',
  'Other',
] as const;

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors';

const labelClass = 'text-xs uppercase tracking-widest text-gray-500';

type IntakeFormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  eventLocation: string;
  eventType: string;
  eventDate: string;
  attendeeCount: string;
  timeline: string;
  referralSource: string;
  projectDetails: string;
};

const initialFormState: IntakeFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  eventLocation: '',
  eventType: '',
  eventDate: '',
  attendeeCount: '',
  timeline: '',
  referralSource: '',
  projectDetails: '',
};

export default function Contact() {
  const content = useContent();
  const contact = content.contact;
  const contactImage =
    content.hero?.images?.[0] ?? content.work?.projects?.[0]?.image ?? CONTACT_IMAGE_FALLBACK;
  const [formData, setFormData] = useState<IntakeFormData>(initialFormState);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          eventLocation: formData.eventLocation,
          eventType: formData.eventType,
          eventDate: formData.eventDate,
          attendeeCount: formData.attendeeCount,
          timeline: formData.timeline,
          referralSource: formData.referralSource,
          projectDetails: formData.projectDetails,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Something went wrong');
      }
      setStatus('success');
      setFormData(initialFormState);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit');
    }
  }
  const safeContact = {
    headline: contact?.headline ?? "LET'S MAKE YOU\nTHE HERO.",
    subhead: contact?.subhead ?? "We're here to help.",
    email: contact?.email ?? 'info@latestcrazeproductions.com',
    phone: contact?.phone ?? '+1 (480) 626-5231',
    address: contact?.address ?? '4035 E Magnolia St Phoenix, AZ 85034',
    ctaText: contact?.ctaText ?? 'Initiate Project',
    copyright: contact?.copyright ?? '© 2025 Latest Craze Productions.',
    footerLinks: Array.isArray(contact?.footerLinks) ? contact.footerLinks : [],
  };

  return (
    <section id="contact" className="py-24 bg-black text-white relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
              {safeContact.headline.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-md">{safeContact.subhead}</p>

            <div className="relative aspect-[4/3] max-w-md rounded-2xl overflow-hidden border border-white/10 mb-12">
              <Image
                src={getOptimizedImageUrl(contactImage, { width: 1200, quality: 68 })}
                alt="Latest Craze Productions"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-6">
              <a href={`mailto:${safeContact.email}`} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10">
                  <Mail className="w-5 h-5" />
                </div>
                <span>{safeContact.email}</span>
              </a>
              <a href={`tel:${(safeContact.phone ?? '').replace(/\D/g, '')}`} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10">
                  <Phone className="w-5 h-5" />
                </div>
                <span>{safeContact.phone}</span>
              </a>
              <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>{safeContact.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] p-8 md:p-12 rounded-3xl border border-white/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'success' && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>Thank you! We&apos;ve received your message and sent a confirmation to your email.</p>
                </div>
              )}
              {status === 'error' && (
                <div className="p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                  {errorMessage}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs uppercase tracking-widest text-gray-500">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-company" className="text-xs uppercase tracking-widest text-gray-500">Company</label>
                  <input
                    id="contact-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Tech Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-email" className={labelClass}>Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-phone" className={labelClass}>Phone</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className={inputClass}
                    placeholder="(480) 555-1234"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-location" className={labelClass}>Event Location</label>
                <input
                  id="contact-location"
                  type="text"
                  value={formData.eventLocation}
                  onChange={(e) => setFormData((p) => ({ ...p, eventLocation: e.target.value }))}
                  className={inputClass}
                  placeholder="City, state or venue name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-event-type" className={labelClass}>Event Type</label>
                  <select
                    id="contact-event-type"
                    value={formData.eventType}
                    onChange={(e) => setFormData((p) => ({ ...p, eventType: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">Select type...</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-event-date" className={labelClass}>Event Date</label>
                  <input
                    id="contact-event-date"
                    type="text"
                    value={formData.eventDate}
                    onChange={(e) => setFormData((p) => ({ ...p, eventDate: e.target.value }))}
                    className={inputClass}
                    placeholder="e.g. March 2026 or TBD"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-attendees" className={labelClass}>Approximate Attendees</label>
                  <input
                    id="contact-attendees"
                    type="text"
                    value={formData.attendeeCount}
                    onChange={(e) => setFormData((p) => ({ ...p, attendeeCount: e.target.value }))}
                    className={inputClass}
                    placeholder="e.g. 200–500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-timeline" className={labelClass}>Timeline</label>
                  <select
                    id="contact-timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData((p) => ({ ...p, timeline: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
                    {TIMELINE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-referral" className={labelClass}>How did you hear about us?</label>
                <select
                  id="contact-referral"
                  value={formData.referralSource}
                  onChange={(e) => setFormData((p) => ({ ...p, referralSource: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  {REFERRAL_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-details" className={labelClass}>Project Details</label>
                <textarea
                  id="contact-details"
                  rows={4}
                  value={formData.projectDetails}
                  onChange={(e) => setFormData((p) => ({ ...p, projectDetails: e.target.value }))}
                  className={`${inputClass} resize-none`}
                    placeholder="Tell us about your event..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
                <span>{status === 'loading' ? 'Sending...' : safeContact.ctaText}</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

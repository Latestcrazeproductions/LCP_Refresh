'use client';

import { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export default function Contact() {
  const { contact } = useContent();
  const [formData, setFormData] = useState({ name: '', company: '', email: '', projectDetails: '' });
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
          projectDetails: formData.projectDetails,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Something went wrong');
      }
      setStatus('success');
      setFormData({ name: '', company: '', email: '', projectDetails: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit');
    }
  }
  const safeContact = {
    headline: contact?.headline ?? "LET'S MAKE YOU\nTHE HERO.",
    subhead: contact?.subhead ?? "We're here to help.",
    email: contact?.email ?? 'production@nexusav.com',
    phone: contact?.phone ?? '+1 (555) 012-3456',
    address: contact?.address ?? '101 Tech Plaza, San Francisco, CA',
    ctaText: contact?.ctaText ?? 'Initiate Project',
    copyright: contact?.copyright ?? '© 2025 Nexus AV Productions.',
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

              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-xs uppercase tracking-widest text-gray-500">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-details" className="text-xs uppercase tracking-widest text-gray-500">Project Details</label>
                <textarea
                  id="contact-details"
                  rows={4}
                  value={formData.projectDetails}
                  onChange={(e) => setFormData((p) => ({ ...p, projectDetails: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
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
        
        <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
          <p>{safeContact.copyright}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {safeContact.footerLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

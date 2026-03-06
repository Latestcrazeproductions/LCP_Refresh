'use client';

import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export default function Contact() {
  const { contact } = useContent();
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
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Company</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Tech Corp"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Project Details</label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us about your event..."
                />
              </div>

              <button className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group">
                <span>{safeContact.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

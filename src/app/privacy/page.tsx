import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ContentProvider } from '@/context/ContentContext';
import { getSiteContent } from '@/lib/content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for Latest Craze Productions. How we use cookies, collect data, and protect your information.',
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default async function PrivacyPage() {
  const content = await getSiteContent();

  return (
    <ContentProvider content={content}>
      <main className="bg-[#050505] min-h-screen text-white">
        <Navbar />
        <article className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-gray-400 mb-6">Last updated: March 2025</p>

          <section className="space-y-6 text-gray-300">
            <h2 className="text-xl font-semibold text-white">Overview</h2>
            <p>
              Latest Craze Productions (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) respects your privacy. This policy explains how we collect, use, and protect your information when you visit our website.
            </p>

            <h2 className="text-xl font-semibold text-white">Cookies</h2>
            <p>
              We use cookies and similar technologies to improve your experience, analyze site traffic, and support marketing. You can customize your cookie preferences when you first visit or at any time by clearing cookies and revisiting.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Essential:</strong> Required for the site to function.</li>
              <li><strong>Analytics:</strong> Help us understand how visitors use our site.</li>
              <li><strong>Marketing:</strong> Enable personalized outreach and business growth.</li>
              <li><strong>Preferences:</strong> Remember your cookie choices.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white">Data We Collect</h2>
            <p>
              When you consent to cookies, we may collect: anonymized identifiers (e.g., hashed IP), consent preferences, device/browser signals, geographic region, referral source, and—if you opt in—your email address for marketing communications.
            </p>

            <h2 className="text-xl font-semibold text-white">How We Use Your Data</h2>
            <p>
              We use collected data to: improve our services, personalize your experience, analyze traffic and trends, send marketing communications (with your consent), and for business development. With appropriate consent, we may share aggregated or anonymized data with partners or for commercial purposes.
            </p>

            <h2 className="text-xl font-semibold text-white">Your Rights</h2>
            <p>
              You may withdraw consent, request access to your data, or request deletion. Contact us at{' '}
              <a href="mailto:info@latestcrazeproductions.com" className="text-blue-400 hover:text-blue-300 underline">
                info@latestcrazeproductions.com
              </a>.
            </p>

            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p>
              Latest Craze Productions, 4035 E Magnolia St, Phoenix, AZ 85034. Phone:{' '}
              <a href="tel:+14806265231" className="text-blue-400 hover:text-blue-300 underline">+1 (480) 626-5231</a>.
            </p>
          </section>

          <p className="mt-12">
            <Link href="/" className="text-blue-400 hover:text-blue-300 underline">← Back to home</Link>
          </p>
        </article>
        <Footer />
      </main>
    </ContentProvider>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ContentProvider } from '@/context/ContentContext';
import { getSiteContent } from '@/lib/content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service for Latest Craze Productions. Terms and conditions for using our website and services.',
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default async function TermsPage() {
  const content = await getSiteContent();

  return (
    <ContentProvider content={content}>
      <main className="bg-[#050505] min-h-screen text-white">
        <Navbar />
        <article className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: March 2025</p>

          <section className="space-y-6 text-gray-300">
            <h2 className="text-xl font-semibold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using the website of Latest Craze Productions (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use our website or services.
            </p>

            <h2 className="text-xl font-semibold text-white">2. Services</h2>
            <p>
              Latest Craze Productions provides corporate event production services, including LED video walls, intelligent lighting, stage design, audio, scenic design, and projection mapping. Service availability, scope, and pricing are subject to separate agreements. This website is for informational purposes.
            </p>

            <h2 className="text-xl font-semibold text-white">3. Use of Website</h2>
            <p>
              You agree to use this website only for lawful purposes. You may not: (a) use the site in any way that violates laws or regulations; (b) attempt to gain unauthorized access to our systems or networks; (c) transmit malware or harmful code; (d) scrape, copy, or resell our content without permission; or (e) use the site to harass, defame, or harm others.
            </p>

            <h2 className="text-xl font-semibold text-white">4. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and design, is owned by Latest Craze Productions or its licensors. You may not reproduce, distribute, or create derivative works without our prior written consent.
            </p>

            <h2 className="text-xl font-semibold text-white">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Latest Craze Productions shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of this website or our services. Our total liability shall not exceed the amount you paid us for the relevant services, if any.
            </p>

            <h2 className="text-xl font-semibold text-white">6. Disclaimer of Warranties</h2>
            <p>
              This website and its content are provided &quot;as is&quot; without warranties of any kind, express or implied. We do not warrant that the site will be uninterrupted, error-free, or free of viruses.
            </p>

            <h2 className="text-xl font-semibold text-white">7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible for the content or practices of those sites. Your use of third-party links is at your own risk.
            </p>

            <h2 className="text-xl font-semibold text-white">8. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the State of Arizona, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Maricopa County, Arizona.
            </p>

            <h2 className="text-xl font-semibold text-white">9. Changes</h2>
            <p>
              We may update these Terms from time to time. The &quot;Last updated&quot; date at the top reflects the most recent revision. Continued use of the website after changes constitutes acceptance.
            </p>

            <h2 className="text-xl font-semibold text-white">10. Contact</h2>
            <p>
              For questions about these Terms, contact us at{' '}
              <a href="mailto:info@latestcrazeproductions.com" className="text-blue-400 hover:text-blue-300 underline">
                info@latestcrazeproductions.com
              </a>{' '}
              or 4035 E Magnolia St, Phoenix, AZ 85034.
            </p>
          </section>

          <p className="mt-12">
            <Link href="/" className="text-blue-400 hover:text-blue-300 underline">← Back to home</Link>
          </p>
          <p className="mt-4">
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</Link>
          </p>
        </article>
        <Footer />
      </main>
    </ContentProvider>
  );
}

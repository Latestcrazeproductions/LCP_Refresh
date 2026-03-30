import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { INTERNAL_FORMS } from '@/lib/internal-forms-config';

type InternalFormsHubProps = {
  /** Primary navigation (e.g. back to site or CMS dashboard) */
  backHref: string;
  backLabel: string;
  /** Optional secondary link for staff */
  secondaryLink?: { href: string; label: string };
};

export function InternalFormsHub({
  backHref,
  backLabel,
  secondaryLink,
}: InternalFormsHubProps) {
  return (
    <div className="min-h-screen bg-nexus-black px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href={backHref}
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            {backLabel}
          </Link>
          {secondaryLink ? (
            <Link
              href={secondaryLink.href}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              {secondaryLink.label}
            </Link>
          ) : null}
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Internal Forms
        </h1>
        <p className="text-gray-400 mb-4">
          Choose a form to get started. Google Forms are the default until the
          integrated forms are finished.
        </p>
        <p className="text-gray-500 text-sm mb-10">
          Google Form links open in a new tab.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {INTERNAL_FORMS.map((form) =>
            form.available ? (
              <div
                key={form.id}
                className="flex flex-col p-8 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/[0.07] transition-all"
              >
                <span className="text-4xl mb-4 block">📋</span>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {form.title}
                </h2>
                <p className="text-gray-400 text-sm flex-1">{form.description}</p>
                <a
                  href={form.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white hover:border-blue-400/50 hover:bg-white/[0.1] hover:text-blue-100 transition-all w-fit"
                >
                  <ExternalLink className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
                  Open Google Form
                </a>
              </div>
            ) : (
              <div
                key={form.id}
                className="block p-8 bg-white/5 border border-white/5 rounded-xl opacity-60 cursor-not-allowed"
              >
                <span className="text-4xl mb-4 block">📋</span>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {form.title}
                </h2>
                <p className="text-gray-400 text-sm">{form.description}</p>
                <span className="inline-block mt-4 text-gray-500 text-sm">
                  Coming soon
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

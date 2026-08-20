import Link from 'next/link';

interface RelatedLink {
  href: string;
  label: string;
}

interface RelatedLinksProps {
  links: RelatedLink[];
  title?: string;
  variant?: 'dark' | 'light';
}

export function RelatedLinks({ links, title = 'Explore more', variant = 'dark' }: RelatedLinksProps) {
  const isLight = variant === 'light';
  return (
    <section
      className={`px-6 py-12 ${isLight ? 'border-t border-slate-200 bg-stone-50' : 'border-t border-white/10'}`}
    >
      <div className="mx-auto max-w-7xl">
        <h2 className={`mb-4 text-lg font-semibold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
          {title}
        </h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  isLight
                    ? 'font-medium text-blue-700 underline-offset-4 hover:text-blue-800 hover:underline'
                    : 'text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline'
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

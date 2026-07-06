import Link from 'next/link';

interface RelatedLink {
  href: string;
  label: string;
}

interface RelatedLinksProps {
  links: RelatedLink[];
  title?: string;
}

export function RelatedLinks({ links, title = 'Explore more' }: RelatedLinksProps) {
  return (
    <section className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-400">{title}</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

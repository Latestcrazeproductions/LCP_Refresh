import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Internal Forms',
  robots: { index: false, follow: false },
};

export default function InternalFormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

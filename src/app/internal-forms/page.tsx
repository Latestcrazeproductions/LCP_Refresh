import { InternalFormsHub } from '@/components/InternalFormsHub';

export default function InternalFormsPage() {
  return (
    <InternalFormsHub
      backHref="/"
      backLabel="← Back to site"
      secondaryLink={{ href: '/cms/login', label: 'CMS login (staff)' }}
    />
  );
}

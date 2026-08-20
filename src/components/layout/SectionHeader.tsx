interface SectionHeaderProps {
  title: string;
  subhead?: string;
  className?: string;
  variant?: 'dark' | 'light';
}

export function SectionHeader({
  title,
  subhead,
  className = '',
  variant = 'dark',
}: SectionHeaderProps) {
  const isLight = variant === 'light';
  return (
    <div className={`border-b pb-8 ${isLight ? 'border-slate-200' : 'border-white/10'} ${className}`}>
      <h2 className={`text-3xl font-bold md:text-4xl ${isLight ? 'text-slate-900' : ''}`}>{title}</h2>
      {subhead && (
        <p className={`mt-3 max-w-xl ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{subhead}</p>
      )}
    </div>
  );
}

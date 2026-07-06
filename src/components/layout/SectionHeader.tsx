interface SectionHeaderProps {
  title: string;
  subhead?: string;
  className?: string;
}

export function SectionHeader({ title, subhead, className = '' }: SectionHeaderProps) {
  return (
    <div className={`border-b border-white/10 pb-8 ${className}`}>
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      {subhead && <p className="mt-3 max-w-xl text-gray-400">{subhead}</p>}
    </div>
  );
}

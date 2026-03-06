import '../globals.css';

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-nexus-black text-white"
      style={{
        backgroundColor: '#050505',
        color: '#ffffff',
        fontFamily: 'var(--font-sans), Inter, system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'nexus-black': '#050505',
        'nexus-gray': '#1a1a1a',
        'nexus-accent': '#3b82f6',
      },
    },
  },
  plugins: [],
  safelist: [
    // Ensure base layout classes from globals.css @apply are never purged
    'bg-nexus-black',
    'font-sans',
    'font-display',
    'antialiased',
  ],
};

export default config;

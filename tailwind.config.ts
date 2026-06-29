import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F6F2EB',
        cream: '#EFE9DE',
        sand: '#E3D9C7',
        taupe: '#C8BBA6',
        'taupe-deep': '#A9987F',
        charcoal: '#1C1A17',
        'charcoal-soft': '#2A2722',
        gold: '#B8965A',
        'gold-light': '#CBAE78',
      },
      fontFamily: {
        sans: ['var(--font-general-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-general-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero-d': ['clamp(3rem, 13vw, 11.25rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'hero-t': ['clamp(3rem, 9vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display': ['clamp(2.5rem, 6vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
        'section': ['clamp(2rem, 4.5vw, 4rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
      },
      letterSpacing: {
        'tightest': '-0.05em',
        'eyebrow': '0.28em',
      },
      spacing: {
        section: 'clamp(7rem, 14vw, 13.75rem)',
      },
      maxWidth: {
        container: '1280px',
        wide: '1480px',
      },
      transitionTimingFunction: {
        'lux': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
};

export default config;

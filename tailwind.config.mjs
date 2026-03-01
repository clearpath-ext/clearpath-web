/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070F1E',
          900: '#0D1F3C',
          800: '#112240',
          700: '#162D50',
          600: '#1E3A5F',
        },
        brand: {
          blue:  '#5B9BF8',
          green: '#6DD9A8',
          'blue-muted':  '#3A7BD5',
          'green-muted': '#4ABF8A',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #5B9BF8, #6DD9A8)',
        'hero-gradient':  'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(91,155,248,0.18) 0%, transparent 70%)',
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease forwards',
        'fade-in':   'fadeIn 0.5s ease forwards',
        'glow-pulse':'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

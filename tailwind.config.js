/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#0284C7', 50: '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC', 400: '#38BDF8', 500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1', 800: '#075985', 900: '#0C4A6E' },
        secondary: { DEFAULT: '#06B6D4', 50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490' },
        slate:     { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A' },
        accent:    '#67E8F9',
        surface:   '#F8FAFC',
        card:      '#FFFFFF',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'gradient-sky':     'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)',
        'gradient-light':   'linear-gradient(135deg, #F0F9FF 0%, #ECFEFF 100%)',
        'gradient-card':    'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        'gradient-hero':    'linear-gradient(135deg, #0C4A6E 0%, #0284C7 50%, #06B6D4 100%)',
        'gradient-section': 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(2,132,199,0.06)',
        'card-md': '0 4px 24px rgba(2,132,199,0.10), 0 1px 4px rgba(0,0,0,0.04)',
        'card-lg': '0 8px 40px rgba(2,132,199,0.14), 0 2px 8px rgba(0,0,0,0.06)',
        'btn':     '0 4px 14px rgba(2,132,199,0.35)',
        'btn-lg':  '0 8px 24px rgba(2,132,199,0.40)',
        'glow':    '0 0 30px rgba(2,132,199,0.20)',
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
      transitionTimingFunction: { 'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      maxWidth: { '8xl': '88rem', '9xl': '96rem' },
    },
  },
  plugins: [],
}

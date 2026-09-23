/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#05050a',
          900: '#0a0a14',
          800: '#121220',
          700: '#1b1b2e',
          600: '#26263e',
        },
        brand: {
          50: '#f2f0ff',
          100: '#e6e1ff',
          200: '#c9beff',
          300: '#a794ff',
          400: '#8b6bff',
          500: '#7c4dff',
          600: '#6a2df0',
          700: '#5620c4',
          800: '#421a97',
          900: '#2e1470',
        },
        accent: {
          400: '#4fd1ff',
          500: '#22b8f2',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'sans-serif'],
      },
      backgroundImage: {
        'grid-glow': 'radial-gradient(circle at 20% -10%, rgba(124,77,255,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(34,184,242,0.25), transparent 40%)',
        'hero-gradient': 'linear-gradient(135deg, #7c4dff 0%, #22b8f2 100%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(124,77,255,0.35)',
        card: '0 8px 30px rgba(0,0,0,0.35)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

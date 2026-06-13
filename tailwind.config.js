/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, earthy "fable" palette
        sand: {
          50: '#faf3e6',
          100: '#f3e6cc',
          200: '#e7cf9f',
          300: '#d9b673',
          400: '#c89a4a',
          500: '#b07d2e',
        },
        terracotta: {
          400: '#d97a4e',
          500: '#c25b30',
          600: '#a3461f',
        },
        night: {
          700: '#241a10',
          800: '#1a1208',
          900: '#100b05',
        },
        gold: '#e8b34a',
        ember: '#ff8a3d',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out both',
        'slide-in': 'slide-in 0.5s ease-out both',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

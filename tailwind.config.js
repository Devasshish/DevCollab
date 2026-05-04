/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdffe5',
          100: '#f9ffc6',
          200: '#f4ff94',
          300: '#ebff5c',
          400: '#e0ff29',
          500: '#d4ff00',
          600: '#a6cc00',
          700: '#7d9900',
          800: '#5f7306',
          900: '#4e5e0a',
          950: '#293300',
        },
        dark: {
          bg: '#050505',
          surface: '#0d0d0d',
          card: '#111111',
          border: '#1f1f1f',
          muted: '#666666',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        'spin-slow': 'spin 25s linear infinite',
        'marquee': 'marquee 25s linear infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': '0% 50%' },
          '50%': { 'background-size': '200% 200%', 'background-position': '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(212,255,0,0.2), 0 0 60px rgba(212,255,0,0.05)' },
          '50%': { 'box-shadow': '0 0 40px rgba(212,255,0,0.5), 0 0 80px rgba(212,255,0,0.2)' },
        },
        shimmer: {
          from: { 'background-position': '-200% center' },
          to: { 'background-position': '200% center' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
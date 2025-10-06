/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Cyberpunk Red Theme
        cyber: {
          red: '#ff0033',
          darkRed: '#cc0022',
          darkerRed: '#990011',
          black: '#0a0a0a',
          darkGray: '#1a1a1a',
          gray: '#2a2a2a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5', boxShadow: '0 0 10px rgba(255, 0, 51, 0.5)' },
          '50%': { opacity: '1', boxShadow: '0 0 20px rgba(255, 0, 51, 0.9)' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(255, 0, 51, 0.3)',
        'glow-md': '0 0 20px rgba(255, 0, 51, 0.4)',
        'glow-lg': '0 0 40px rgba(255, 0, 51, 0.5)',
        'glow-xl': '0 0 60px rgba(255, 0, 51, 0.6)',
      },
    },
  },
  plugins: [],
}

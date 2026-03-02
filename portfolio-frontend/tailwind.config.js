/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',
        darkSurface: '#1e293b',
        darkBorder: '#334155',
        brandPrimary: '#38bdf8',
        success: '#10b981',
        danger: '#ef4444'
      },
      animation: {
        'flash-green': 'flash-green 1s ease-out',
        'flash-red': 'flash-red 1s ease-out',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        'flash-green': {
          '0%': { backgroundColor: 'rgba(16, 185, 129, 0.4)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'flash-red': {
          '0%': { backgroundColor: 'rgba(239, 68, 68, 0.4)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}

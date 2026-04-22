/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zan Cafe brand palette
        primary: {
          50:  '#edf7f5',
          100: '#c7e9e3',
          200: '#9fd6cc',
          300: '#6dbfb4',
          400: '#3aa89d',
          500: '#1a6b5a',
          600: '#155a4c',
          700: '#10493e',
          800: '#0b3830',
          900: '#062722',
        },
        gold: {
          50:  '#fffce8',
          100: '#fff8c4',
          200: '#fff08a',
          300: '#ffe44d',
          400: '#f5c518',
          500: '#e4b510',
          600: '#c49308',
          700: '#9e7006',
        },
        zan: {
          dark:   '#111111',
          cream:  '#fdf8f0',
          teal:   '#1a6b5a',
          gold:   '#f5c518',
        },
        brand: {
          dark:  '#1e2022',
          light: '#f8f9fa',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        dm:       ['"DM Sans"', 'Inter', 'sans-serif'],
        outfit:   ['Outfit', 'sans-serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease-out both',
        'slide-up':  'slideUp 0.5s ease-out both',
        'pill-float':'pillFloat 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        pillFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1a5f4a', light: '#2d8a6e', dark: '#124a3a', soft: '#e8f5f1' },
        accent:  { DEFAULT: '#e8b931', soft: '#fef9e8' },
        brand:   { bg: '#f8fafc' },
      },
      fontFamily: {
        sans:    ['Cairo', 'Inter', 'sans-serif'],
        display: ['Cairo', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
}

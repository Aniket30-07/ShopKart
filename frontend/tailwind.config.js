/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#244d3f',
        'brand-green-dark': '#1a382e',
        'brand-cream': '#f8f6f0',
        'brand-cream-light': '#fdfcf9',
      },
      fontFamily: {
        'sans': ['"DM Sans"', 'sans-serif'],
        'serif': ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}

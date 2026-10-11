/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        berry: '#3B1F2B',
        strawberry: '#FF6B81',
        mango: '#FFC857',
        cream: '#FFF7ED',
        mint: '#A8D5BA',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

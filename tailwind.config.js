/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2DD4BF',
          DEFAULT: '#14B8A6',
          dark: '#0F766E',
        },
        secondary: {
          DEFAULT: '#6366F1',
        },
        error: '#F43F5E',
        success: '#10B981',
      }
    },
  },
  plugins: [],
}

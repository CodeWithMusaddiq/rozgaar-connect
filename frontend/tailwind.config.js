/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0F172A',
          light: '#1e293b',
        },
        primary: {
          DEFAULT: '#0F172A',
        },
        success: {
          DEFAULT: '#22C55E',
          dark: '#16a34a',
        },
        accent: {
          DEFAULT: '#F97316',
        },
      },
    },
  },
  plugins: [],
}

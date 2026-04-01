/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#121212',
          800: '#1e1e1e',
          700: '#2d2d2d',
        },
        primary: {
          600: '#059669', // Emerald-600
          500: '#10b981', // Emerald-500
          400: '#34d399', // Emerald-400
        },
        accent: {
          600: '#65a30d', // Lime-600
          500: '#84cc16', // Lime-500
        }
      }
    },
  },
  plugins: [],
}

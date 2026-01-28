/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        vinfast: '#003366',
        vinfast_light: '#0066CC',
      }
    },
  },
  plugins: [],
}

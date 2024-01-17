/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,scss,ts}",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: ['0.625rem', '0.875rem'],
      }
    },
  },
  plugins: [],
}


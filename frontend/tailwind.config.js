/** @type {import('tailwindcss').Config} */
export default {
  content: [ './index.html','./src/**/*.{vue,js,ts,jsx,tsx}' ],
  theme: {
    extend: {
      colors: {
        background: '#0A1A2F',  // azul oscuro
        primary:    '#F66B0E',  // naranja FitQuest
        text:       '#F5F0E1',  // blanco roto
      },
      fontFamily: {
        sans: ['Inter','sans-serif'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [ './index.html','./src/**/*.{vue,js,ts,jsx,tsx}' ],
  theme: {
    extend: {
      colors: {
        background:   '#0A1A2F',  // fondo principal de la app
        surface:      '#112233',  // tarjetas
        'surface-alt':'#1E293B',  // tarjetas de progreso/dashboard
        muted:        '#334155',  // botones secundarios, barras de progreso
        primary:      '#F66B0E',  // naranja FitQuest
        text:         '#F5F0E1',  // blanco roto
        warning:      '#FFC107',  // ámbar, avisos
        info:         '#A5B4FC',  // lila, informativo
        success:      '#22C55E',  // verde, éxito
        error:        '#F87171',  // rojo, error
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
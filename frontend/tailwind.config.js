/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0A0A0A',
          dark: '#161616',
          charcoal: '#232323',
          yellow: '#F2B705',
          yellowDark: '#CC9900',
          white: '#FFFFFF',
          offwhite: '#FAFAF8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.06)',
        cardHover: '0 6px 20px rgba(0,0,0,0.10)'
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sumi: '#1A1A18',
        shikkui: '#F7F5F0',
        matcha: '#4A6741',
        koke: '#3B5335',
        suna: '#C4B9A8',
        ishi: '#9B9589',
        washi: '#EAE5DA',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', '"Outfit"', 'sans-serif'],
        drama: ['"Cormorant Garamond"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '2rem',
        '3xl': '3rem',
        '4xl': '4rem',
      },
    },
  },
  plugins: [],
}

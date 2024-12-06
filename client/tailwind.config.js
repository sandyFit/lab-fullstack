/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        'hawaii': '#f9faf7',
        'tahiti': {
          100: 'F6FFFE',
          200: '#D9EDEB',
          700: '#03776B',
        },
        fontFamily: {
          sans: ['Quicksand', 'sans-serif'],
          bai: ['Bai Jamjuree', 'sans-serif'],
          cursive: ['WindSong', 'cursive'],
          anybody: ['Anybody', 'sans-serif'],
          inter: ["Inter", 'sans-serif']
        },
      },
    },
  },
  plugins: [],
};

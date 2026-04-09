/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F2F4F7',
        primary: {
          light: '#333697',
          DEFAULT: '#3736A3',
          dark: '#191A46',
        },
        navy: {
          50: '#EEF2FF',
          100: '#E1E5FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        slate: {
          700: '#454652',
          800: '#191C1E',
        }
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'button': '0 1px 2px rgba(51, 54, 151, 0.2)',
      }
    },
  },
  plugins: [],
}

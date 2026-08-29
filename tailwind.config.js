/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        uzum: {
          DEFAULT: '#7000FF',
          hover: '#5E00D6',
          light: '#F0EBFF',
          accent: '#E8E3FF',
          pink: '#FF007A',
          yellow: '#FFFF00',
          dark: '#1F2026',
          grey: '#8B8E99',
          lightGrey: '#F2F4F7'
        },
        primary: {
          50: '#F0EBFF',
          100: '#E8E3FF',
          200: '#D1C4FF',
          300: '#B599FF',
          400: '#9466FF',
          500: '#7000FF',
          600: '#5E00D6',
          700: '#4D00B0',
          800: '#3D008C',
          900: '#2F006D',
          950: '#1D0044',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

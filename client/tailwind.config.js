/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF7F0',
          100: '#FFEDD9',
          200: '#FFD9B0',
          300: '#FFC080',
          400: '#F59E42',
          500: '#E8751A',
          600: '#D06010',
          700: '#A84B0C',
          800: '#7E3809',
          900: '#5A2807',
        },
        secondary: {
          50: '#FFFAF5',
          100: '#FFF0E0',
          200: '#FFE0C2',
          300: '#FFCFA0',
          400: '#F5B87A',
          500: '#E09A55',
          600: '#C07E3A',
          700: '#9A6330',
          800: '#704828',
          900: '#4A3020',
        },
        accent: {
          50: '#FAF5F0',
          100: '#F0E4D8',
          200: '#DCCAB5',
          300: '#C4A88E',
          400: '#9E7B5D',
          500: '#7A5C40',
          600: '#5C3D24',
          700: '#4A2F1A',
          800: '#3A2312',
          900: '#2A180C',
        },
        cream: '#FFFAF5',
        blush: '#FFF3E8',
        sage: '#7CB47C',
        mocha: '#9E7B5D',
        espresso: '#3A2312',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 25px -5px rgba(232, 117, 26, 0.15)',
        'card-hover': '0 10px 40px -10px rgba(232, 117, 26, 0.25)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}

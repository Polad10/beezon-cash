/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      screens: {
        sm: '400px',
        md: '400px',
        lg: '400px',
        xl: '400px',
      },
      colors: {
        'grey-primary': '#f5f5f5',
        'grey-secondary': '#d3d6da',
        'grey-light': '#ededed',
        'red': '#df4b27',
        'red-light': '#ffd6d6',
        'green': '#5ea650',
        'yellow': '#fd9f00',
        'yellow-light': '#ffdea6',
        'blue': '#3400fc',
        'blue-light': '#4865cc',
        'white': '#ffffff',
        'accent': '#234ad4',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      spacing: {
        '10': '0.62rem',
        '13': '0.81rem',
        '128': '32rem',
        '144': '36rem',
        '3': '0.75rem',
        'badge-height': '1.5rem' 
      },
      borderRadius: {
        '12': '0.75rem',
        '40': '2.5rem',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          'primary': '#d3d6da',
          'primary-content': '#5d5aff',
          'secondary': '#f5f5f5',
          'accent': '#234ad4',
          'neutral': '#ffdea6',
          'base-100': '#ffffff',
          'info': '#ffd6d6',
          'success': '#5ea650',
          'warning': '#fd9f00',
          'error': '#df4b27',
          'accent-content': '#4865CC',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};

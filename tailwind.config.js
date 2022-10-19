/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/app/**/*.html'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['coffee', 'lemonade', 'night', 'valentine', 'aqua', 'cupcake'],
  },
};

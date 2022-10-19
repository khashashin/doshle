/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts}', './src/app/**/*.{html,js,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['coffee', 'lemonade', 'night', 'valentine', 'aqua', 'cupcake'],
    darkTheme: 'lemonade',
  },
};

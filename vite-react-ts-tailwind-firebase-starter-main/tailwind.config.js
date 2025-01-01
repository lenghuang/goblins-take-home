module.exports = {
  mode: 'jit',
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    safeList: [],
    content: ['./index.html', './src/**/*.tsx', './src/**/*.ts'],
  },
  theme: {
    minWidth: {
      40: '10rem',
      60: '15rem',
      80: '20rem',
      100: '25rem',
      320: '80rem',
    },
    maxWidth: {
      120: '30rem',
      160: '40rem',
      200: '50rem',
      320: '80rem',
    },
  },
  variants: {},
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'emerald', // https://daisyui.com/docs/themes/
    ],
  },
};

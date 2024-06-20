/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      ...defaultTheme.screens,
    },
    fontFamily: {
      inter: 'var(--font-inter)',
    },
    extends: {
      typography: ({ theme }) => ({
        violet: {
          css: {
            '--tw-prose-body': theme('colors.violet[800]'),
            '--tw-prose-headings': theme('colors.violet[900]'),
            '--tw-prose-lead': theme('colors.violet[700]'),
            '--tw-prose-links': theme('colors.violet[900]'),
            '--tw-prose-bold': theme('colors.violet[900]'),
            '--tw-prose-counters': theme('colors.violet[600]'),
            '--tw-prose-bullets': theme('colors.violet[400]'),
            '--tw-prose-hr': theme('colors.violet[300]'),
            '--tw-prose-quotes': theme('colors.violet[900]'),
            '--tw-prose-quote-borders': theme('colors.violet[300]'),
            '--tw-prose-captions': theme('colors.violet[700]'),
            '--tw-prose-code': theme('colors.violet[900]'),
            '--tw-prose-pre-code': theme('colors.violet[100]'),
            '--tw-prose-pre-bg': theme('colors.violet[900]'),
            '--tw-prose-th-borders': theme('colors.violet[300]'),
            '--tw-prose-td-borders': theme('colors.violet[200]'),
            '--tw-prose-invert-body': theme('colors.violet[200]'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.violet[300]'),
            '--tw-prose-invert-links': theme('colors.white'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.violet[400]'),
            '--tw-prose-invert-bullets': theme('colors.violet[600]'),
            '--tw-prose-invert-hr': theme('colors.violet[700]'),
            '--tw-prose-invert-quotes': theme('colors.violet[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.violet[700]'),
            '--tw-prose-invert-captions': theme('colors.violet[400]'),
            '--tw-prose-invert-code': theme('colors.white'),
            '--tw-prose-invert-pre-code': theme('colors.violet[300]'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': theme('colors.violet[600]'),
            '--tw-prose-invert-td-borders': theme('colors.violet[700]'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
};
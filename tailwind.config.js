/** @type {import('tailwindcss').Config} */

const { nextui } = require('@nextui-org/react')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FCF8E8',
        lemon: '#FDFFAB',
        baige: {
          300: '#FFFBE9',
          500: '#F4EAD5',
          700: '#F1E0AC',
        },
        grayBaige: {
          400: '#F0EBE3',
          600: '#E4DCCF',
        },
        pastelYellow: {
          200: '#FDFFCD',
          300: '#FFF6BD',
          500: '#F5F0BB',
          700: '#F1EB90',
        },
        coral: {
          200: '#FFD4B2',
          400: '#ECB390',
          500: '#FF9A76',
          600: '#DF7861',
        },
        salmon: {
          400: '#F7C5A8',
          500: '#FFB996',
        },
        sage: {
          300: '#D9EDBF',
          400: '#C4DFAA',
          500: '#90C8AC',
          600: '#94B49F',
          650: '#85A28F',
          700: '#678983',
          750: '#5C7B75',
          800: '#526d68',
          850: '#485f5b',
          900: '#3d524e',
        },
        olive: {
          200: '#DAE2B6',
          300: '#CCD6A6',
          700: '#9FBB73',
        },
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        omyu: ['omyu_pretty', 'sans-serif'],
        suite: ['SUITE-Regular', 'sans-serif'],
        lotteria: ['LOTTERIACHAB', 'sans-serif'],
        giants: ['Giants-Inline', 'sans-serif'],
        jeju: ['EF_jejudoldam', 'sans-serif'],
        jalnan: ['JalnanGothic', 'sans-serif'],
        pretendard: ['Pretendard-Regular', 'sans-serif'],
      },
    },
  },
  plugins: [
    nextui(),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}

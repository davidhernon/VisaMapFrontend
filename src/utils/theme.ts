import { Theme } from 'types/theme-types';
const defaultTheme = require('tailwindcss/defaultTheme');
const tailwindTheme: Theme = require('tailwind.config');

export const theme = tailwindTheme;
export const colors: Theme['theme']['extend']['colors'] = {
  ...defaultTheme.colors,
  ...tailwindTheme.theme.extend.colors,
};

  
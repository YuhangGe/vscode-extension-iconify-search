import { addDynamicIconSelectors } from '@iconify/tailwind';
// import { iconsPlugin, dynamicIconsPlugin } from '@egoist/tailwindcss-icons';

import plugin from 'tailwindcss/plugin';
import { vscodeColors, themeColors, themeDarkColors } from './src/theme-colors';

const antdColors = Object.keys(themeColors);

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector'],
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    colors: {
      ...Object.fromEntries(antdColors.map((clr) => [clr, `var(--antd-${clr})`])),
      ...vscodeColors,
    },
  },
  plugins: [
    addDynamicIconSelectors(),
    // iconsPlugin(),
    // dynamicIconsPlugin(),
    plugin(function ({ addComponents }) {
      addComponents({
        ':root': Object.fromEntries(antdColors.map((clr) => [`--antd-${clr}`, themeColors[clr]])),
        '[data-theme=dark]': Object.fromEntries(
          antdColors.map((clr) => [`--antd-${clr}`, themeDarkColors[clr]]),
        ),
      });
    }),
  ],
};

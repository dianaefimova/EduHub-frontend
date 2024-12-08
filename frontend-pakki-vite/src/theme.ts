// src/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#ebd3ff',   // Slightly darker lightest shade
      100: '#d8baff',
      200: '#c6a0ff',
      300: '#b588ff',
      400: '#a370ff',
      500: '#9258ff',   // Main color, slightly darker
      600: '#8240e6',
      700: '#7135cc',
      800: '#6028b3',
      900: '#4f1b99',   // Slightly darker darkest shade
    },
  },
});

export default theme;

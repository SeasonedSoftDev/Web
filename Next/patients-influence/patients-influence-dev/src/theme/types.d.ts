import {
  PaletteColor,
  PaletteColorOptions,
} from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    default: PaletteColor;
  }
  interface PaletteOptions {
    default: PaletteColorOptions;
  }
  interface CommonColors {
    gray: Array<string>;
    background: string;
    stepper: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    default: true;
  }
}

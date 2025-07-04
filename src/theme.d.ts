/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaletteOptions, Palette } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary?: Palette['tertiary'];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['tertiary'];
  }
}

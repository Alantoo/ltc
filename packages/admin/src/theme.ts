import { defaultTheme, RaThemeOptions } from 'react-admin';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import {
  Palette,
  PaletteOptions,
  PaletteColor,
} from '@material-ui/core/styles/createPalette';

interface MyPalette extends Palette {
  third: PaletteColor;
}

export interface MyTheme extends Theme {
  palette: MyPalette;
}

interface MyPaletteOptions extends PaletteOptions {
  third?: PaletteColor;
}

interface MyThemeOptions extends RaThemeOptions {
  palette?: MyPaletteOptions;
}

const themeOptions: MyThemeOptions = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    third: {
      main: '#031F46',
      light: '#031F46',
      dark: '#031F46',
      contrastText: '#031F46',
    },
  },
};

export const theme = createMuiTheme(themeOptions);

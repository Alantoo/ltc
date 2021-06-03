import { createMuiTheme, Theme, ThemeOptions } from '@material-ui/core/styles';
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

interface MyThemeOptions extends ThemeOptions {
  palette?: MyPaletteOptions;
}

const themeOptions: MyThemeOptions = {
  palette: {
    primary: {
      main: '#e7a214',
    },
    third: {
      main: 'back',
      light: 'black',
      dark: 'black',
      contrastText: 'black',
    },
  },
  breakpoints: {
    values: {
      xs: 650,
      sm: 700,
      md: 800,
      lg: 940,
      xl: 1100,
    },
  },
};

export const theme = createMuiTheme(themeOptions);

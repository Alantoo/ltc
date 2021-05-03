import { createMuiTheme, Theme, ThemeOptions } from '@material-ui/core/styles';
import { Palette, PaletteColor } from '@material-ui/core/styles/createPalette';

interface MyPalette extends Palette {
  third: PaletteColor;
}

export interface MyTheme extends Theme {
  palette: MyPalette;
}

interface MyThemeOptions extends ThemeOptions {
  palette?: MyPalette;
}

const themeOptions: MyThemeOptions = {
  breakpoints: {
    values: {
      xs: 650,
      sm: 800,
      md: 900,
      lg: 1100,
      xl: 1340,
    },
  },
} as MyThemeOptions;

export const theme = createMuiTheme(themeOptions);

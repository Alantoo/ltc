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
      sm: 700,
      md: 800,
      lg: 940,
      xl: 1100,
    },
  },
} as MyThemeOptions;

export const theme = createMuiTheme(themeOptions);

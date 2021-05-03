import React from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  DefaultTheme,
} from '@material-ui/styles';
import { MyTheme } from '../theme';

type ClassKey = 'root';

const styles = (theme: DefaultTheme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {
      display: 'flex',
    },
  });
};

type LayoutProps = WithStyles<ClassKey>;

const LayoutView = ({ classes }: LayoutProps) => {
  return <div className={classes.root}>Header Body Footer</div>;
};

export const Layout = withStyles(styles)(LayoutView);

export default Layout;

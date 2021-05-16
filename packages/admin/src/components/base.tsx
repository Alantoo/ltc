import React from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { MyTheme } from 'theme';

type ClassKey = 'main';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    main: {},
  });
};

type DashboardPageProps = WithStyles<ClassKey> & {
  title?: string | React.ReactElement<any>;
  theme?: Theme;
};

const DashboardPageView = ({ classes, title }: DashboardPageProps) => {
  return <div className={classes.main}>Dashboard</div>;
};

export const DashboardPage = withStyles(styles)(DashboardPageView);

export default DashboardPage;

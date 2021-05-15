import React, { useState, useCallback } from 'react';
import {
  withStyles,
  Theme,
  StyleRules,
  WithStyles,
} from '@material-ui/core/styles';

const styles = (theme: Theme): StyleRules => ({
  main: {},
});

type DashboardPageProps = WithStyles & {
  title?: string | React.ReactElement<any>;
  theme?: Theme;
};

const DashboardPageView = ({ classes, title }: DashboardPageProps) => {
  return <div className={classes.main}>Dashboard</div>;
};

export const DashboardPage = withStyles(styles)(DashboardPageView);

export default DashboardPage;

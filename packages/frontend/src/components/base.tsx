import React, { useContext, useCallback } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { MyTheme } from '../theme';

type ClassKey = 'root';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
  });
};

type LoginFormProps = WithStyles<ClassKey>;

const LoginFormView = ({ classes }: LoginFormProps) => {
  return <div></div>;
};

export const LoginForm = withStyles(styles)(LoginFormView);

export default LoginForm;

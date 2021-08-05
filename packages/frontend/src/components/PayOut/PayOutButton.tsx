import React, { useContext, useCallback } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { MyTheme } from 'theme';
import { DataContext } from 'contexts/DataContext';

type ClassKey = 'root';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
  });
};

type PayOutButtonProps = WithStyles<ClassKey>;

const PayOutButtonView = ({ classes }: PayOutButtonProps) => {
  const { payOutPopupOpened, setPayOutPopupOpened } = useContext(DataContext);

  const onClick = () => {
    setPayOutPopupOpened(true);
  };

  return (
    <Button onClick={onClick} variant="contained" color="primary">
      Get Paid
    </Button>
  );
};

export const PayOutButton = withStyles(styles)(PayOutButtonView);

export default PayOutButton;

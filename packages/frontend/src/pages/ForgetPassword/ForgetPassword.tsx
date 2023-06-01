import React from 'react';
import { useLocation } from 'react-router';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { AuthForms, formTypes } from 'components/LoginPage';
import { MyTheme } from 'theme';

type ClassKey = 'root' | 'card';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      padding: '22px 24px',
      borderRadius: 15,
      position: 'relative',
      width: '100%',
      maxWidth: 400,
      border: 'solid 1px #ccc',
      boxShadow:
        'inset 32.6px -32.6px 32.6px rgba(194, 194, 194, 0.176), inset -32.6px 32.6px 32.6px rgba(255, 255, 255, 0.176)',
      [myTheme.breakpoints.down('sm')]: {
        maxWidth: 500,
        margin: '0 auto',
      },
    },
  });
};

type ForgetPasswordProps = WithStyles<ClassKey>;

const ForgetPasswordView = ({ classes }: ForgetPasswordProps) => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  const formType =
    userId && token ? formTypes.RESET_PASSWORD : formTypes.FORGET_PASSWORD;

  return (
    <Container maxWidth="xl" className={classes.root}>
      <Card className={classes.card} elevation={3}>
        <CardContent>
          {/*@ts-ignore*/}
          <AuthForms formType={formType} />
        </CardContent>
      </Card>
    </Container>
  );
};

export const ForgetPassword = withStyles(styles)(ForgetPasswordView);

export default ForgetPassword;

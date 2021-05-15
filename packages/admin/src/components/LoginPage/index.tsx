import React, { useState, useCallback } from 'react';
import { useLogin } from 'react-admin';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  withStyles,
  Theme,
  StyleRules,
  WithStyles,
} from '@material-ui/core/styles';

const styles = (theme: Theme): StyleRules => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '1px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage:
      'radial-gradient(circle at 50% 14em, #bbb 0%, #ccc 60%, #ddd 100%)',
  },
  card: {
    minWidth: 300,
    marginTop: '10em',
  },
  cardActions: {
    flexDirection: 'column',
  },
  button: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    marginLeft: '0 !important',
  },
  icon: {
    marginRight: 10,
  },
});

type Props = WithStyles & {
  title?: string | React.ReactElement<any>;
  theme?: Theme;
};

const LoginPageView = ({ classes, title }: Props) => {
  const [loading, setLoading] = useState(false);
  const login = useLogin();

  const onGoogleClick = useCallback(() => {
    login({ provider: 'Google' });
    setLoading(true);
  }, [login, setLoading]);

  const onMetamaskClick = useCallback(() => {
    login({ provider: 'Metamask' });
    setLoading(true);
  }, [login, setLoading]);

  return (
    <div className={classes.main}>
      <Card className={classes.card}>
        <CardActions className={classes.cardActions}>
          <Button
            variant="contained"
            type="button"
            color="primary"
            disabled={loading}
            className={classes.button}
            onClick={onMetamaskClick}
          >
            {loading && (
              <CircularProgress
                className={classes.icon}
                size={18}
                thickness={2}
              />
            )}
            Sign in with Metamask
          </Button>

          <Button
            variant="contained"
            type="button"
            color="secondary"
            disabled={loading}
            className={classes.button}
            onClick={onGoogleClick}
          >
            {loading && (
              <CircularProgress
                className={classes.icon}
                size={18}
                thickness={2}
              />
            )}
            Sign in with Google
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export const LoginPage = withStyles(styles)(LoginPageView);

export default LoginPage;

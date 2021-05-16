import React from 'react';
import { usePermissions } from 'react-admin';
import { useHistory } from 'react-router-dom';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { AuthForms } from 'components/LoginPage/AuthForms';
import { MyTheme } from 'theme';

type ClassKey = 'main' | 'card' | 'cardActions';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
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
  });
};

type Props = WithStyles<ClassKey> & {
  title?: string | React.ReactElement<any>;
  theme?: Theme;
};

const LoginPageView = ({ classes, title }: Props) => {
  const { permissions, loading } = usePermissions();
  const history = useHistory();

  if (loading) {
    return null;
  }

  if (permissions) {
    history.push('/');
    return null;
  }

  return (
    <div className={classes.main}>
      <Card className={classes.card}>
        <CardActions className={classes.cardActions}>
          <AuthForms />
        </CardActions>
      </Card>
    </div>
  );
};

export const LoginPage = withStyles(styles)(LoginPageView);

export default LoginPage;

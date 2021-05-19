import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import logo from 'assets/logo.png';
import { formTypes } from 'components/LoginPage';
import { AuthContext } from 'contexts/AuthContext';
import { MyTheme } from 'theme';

type ClassKey = 'header' | 'headerContainer' | 'logo' | 'menu';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  console.log(myTheme);
  return createStyles({
    header: {
      display: 'block',
      padding: '15px 0',
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      maxWidth: 150,
      '& a': {
        display: 'block',
      },
      '& img': {
        display: 'block',
        width: '100%',
        height: 'auto',
      },
    },
    menu: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      '& li': {
        display: 'inline-block',
        marginLeft: 30,
        whiteSpace: 'nowrap',
      },
      '& a': {
        color: 'inherit',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  });
};

type HeaderProps = WithStyles<ClassKey>;

const HeaderView = ({ classes }: HeaderProps) => {
  const { auth, user, loading, setAuthModalOpened } = useContext(AuthContext);
  const history = useHistory();

  const onSignUpClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setAuthModalOpened(formTypes.SIGN_UP);
  }, []);

  const onLogInClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setAuthModalOpened(formTypes.LOGIN);
  }, []);

  const onLogOutClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    auth.logout('').finally(() => {
      history.push('/');
    });
  }, []);

  return (
    <div className={classes.header}>
      <Container className={classes.headerContainer} maxWidth="xl">
        <div className={classes.logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <Typography className={classes.menu}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {loading ? null : user ? (
              <>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <a href="" onClick={onLogOutClick}>
                    Log Out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="" onClick={onSignUpClick}>
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="" onClick={onLogInClick}>
                    Log in
                  </a>
                </li>
              </>
            )}
          </ul>
        </Typography>
      </Container>
    </div>
  );
};

export const Header = withStyles(styles)(HeaderView);

export default Header;

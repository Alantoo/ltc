import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import logo from 'assets/logo.png';
import { formTypes } from 'components/LoginPage';
import { AuthContext } from 'contexts/AuthContext';
import { MyTheme } from 'theme';

type ClassKey =
  | 'header'
  | 'headerContainer'
  | 'logo'
  | 'menu'
  | 'dropdownMenu'
  | 'dropdownMenuTrigger';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    header: {
      display: 'block',
      padding: '0 0',
      zIndex: 1,
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
      '& > ul': {
        listStyle: 'none',
        margin: 0,
        padding: 0,
      },
      '& > ul > li': {
        display: 'inline-block',
        padding: '25px 20px',
        whiteSpace: 'nowrap',
      },
      '& > ul > li a': {
        color: 'inherit',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
    dropdownMenuTrigger: {
      position: 'relative',
      paddingRight: '30px !important',
      transition: 'background ease 0.3s',
      '& > svg': {
        position: 'absolute',
      },
      '&:hover': {
        background: '#eee',
      },
      '&:hover > .dropdownMenu': {
        display: 'block',
      },
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      right: 0,
      background: '#fff',
      boxShadow: '0px 5px 12px rgba(0,0,0,0.5)',
      border: 'solid 1px #ccc',
      display: 'none',
      '& > ul': {
        listStyle: 'none',
        margin: 0,
        padding: '5px 20px',
      },
      '& > ul > li': {
        margin: '5px 0',
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
        <Typography className={classes.menu} component="div">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {loading ? null : user ? (
              <>
                <li className={classes.dropdownMenuTrigger}>
                  <Link to="/profile">Profile</Link>
                  <ArrowDropDownIcon />
                  <div className={`${classes.dropdownMenu} dropdownMenu`}>
                    <ul>
                      <li>
                        <Link to="/profile/referrals">Referral List</Link>
                      </li>
                      <li>
                        <Link to="/profile/rewards">Earnings</Link>
                      </li>
                    </ul>
                  </div>
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

import React from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  DefaultTheme,
} from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import logo from 'assets/logo.png';
import socialFb from 'assets/social/fb.png';
import socialTw from 'assets/social/tw.png';
import socialPin from 'assets/social/pin.png';
import socialInsta from 'assets/social/insta.png';
import { ScrollToTop } from 'components/ScrollToTop';
import { Home } from 'pages/Home';
import { MyTheme } from '../theme';

type ClassKey =
  | 'root'
  | 'header'
  | 'headerContainer'
  | 'logo'
  | 'menu'
  | 'footer'
  | 'footerMenu'
  | 'social';

const styles = (theme: DefaultTheme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {
      display: 'block',
    },
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
    footer: {
      textAlign: 'center',
      padding: '20px 0',
    },
    footerMenu: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      '& li': {
        position: 'relative',
        display: 'inline-block',
        margin: '0 3px',
        paddingLeft: 6,
      },
      '& li:before': {
        content: '""',
        position: 'absolute',
        top: 2,
        bottom: 2,
        left: 0,
        width: 1,
        background: myTheme.palette.text.primary,
      },
      '& li:first-child:before': {
        display: 'none',
      },
      '& li a': {
        color: 'inherit',
        '&:hover': {
          textDecoration: 'none',
        },
      },
    },
    social: {
      listStyle: 'none',
      margin: '0 0 20px',
      padding: 0,
      '& li': {
        display: 'inline-block',
        margin: '0 10px',
      },
    },
  });
};

type LayoutProps = WithStyles<ClassKey>;

const LayoutView = ({ classes }: LayoutProps) => {
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Container className={classes.headerContainer} maxWidth="lg">
          <div className={classes.logo}>
            <a href="/">
              <img src={logo} alt="logo" />
            </a>
          </div>
          <Typography className={classes.menu}>
            <ul>
              <li>
                <a href="">Home</a>
              </li>
              <li>
                <a href="">Sign Up</a>
              </li>
              <li>
                <a href="">Log in</a>
              </li>
            </ul>
          </Typography>
        </Container>
      </div>
      <Home />
      <div className={classes.footer}>
        <Container maxWidth="lg">
          <ul className={classes.social}>
            <li>
              <a href="#">
                <img src={socialFb} alt="facebook" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src={socialTw} alt="twitter" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src={socialPin} alt="pinterest" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src={socialInsta} alt="instagram" />
              </a>
            </li>
          </ul>
          <Typography variant="body2">
            Copyright 2017 LetterCopy.com. All rights reserved.
          </Typography>
          <Typography variant="body2">
            <ul className={classes.footerMenu}>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Term of Use</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </Typography>
        </Container>
      </div>
      <ScrollToTop />
    </div>
  );
};

export const Layout = withStyles(styles)(LayoutView);

export default Layout;

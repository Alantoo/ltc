import React, { useContext, useCallback } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import socialFb from 'assets/social/fb.png';
import socialTw from 'assets/social/tw.png';
import socialPin from 'assets/social/pin.png';
import socialInsta from 'assets/social/insta.png';
import { MyTheme } from 'theme';

type ClassKey = 'footer' | 'footerMenu' | 'social';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
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

type FooterProps = WithStyles<ClassKey>;

const FooterView = ({ classes }: FooterProps) => {
  return (
    <div className={classes.footer}>
      <Container maxWidth="xl">
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
        <Typography variant="body2" component="div">
          Copyright 2022 Globalmoneylist.com. All rights reserved.
        </Typography>
        <Typography variant="body2" component="div">
          <ul className={classes.footerMenu}>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Term of Use</Link>
            </li>
            <li>
              <a href="/Contact">Contact Us</a>
            </li>
            <li>
              <a href="/FAQ">FAQ</a>
            </li>
          </ul>
        </Typography>
      </Container>
    </div>
  );
};

export const Footer = withStyles(styles)(FooterView);

export default Footer;

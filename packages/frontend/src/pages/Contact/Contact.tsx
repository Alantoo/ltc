import React from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { MyTheme } from 'theme';

type ClassKey = 'root' | 'center';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
    center: {
      textAlign: 'center',
    },
  });
};

type PrivacyProps = WithStyles<ClassKey>;

const PrivacyView = ({ classes }: PrivacyProps) => {
  return (
    <Container maxWidth="xl">
      <Typography component="div">
        <h2 className={classes.center}>Contact Us</h2>
        <h2 className={classes.center}>GLOBALMONEYLIST.COM</h2>
        <p>
          <ul>
            <li>Global Money List inc. 155</li>
            <li>155 North Wacker Drive</li>
            <li>Suite #4250</li>
            <li>Chicago, IL 60606</li>
            <li>United States</li>
            <li>Phone: (888) 641-9515</li>
            <li>Fax: 217-996-1638</li>
            <li>Email: support@globalmoneylist.com</li>
          </ul>
        </p>
      </Typography>
    </Container>
  );
};

export const Contact = withStyles(styles)(PrivacyView);

export default Contact;

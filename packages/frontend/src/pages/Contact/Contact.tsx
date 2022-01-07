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
          globalmoneylist.com (“Company” or “we” or “us” or “our”) respects the
          privacy of its users (“user” or “you”) that use our website located at
          http://lettercopy.com, including other media forms, media channels,
          mobile website or mobile application related or connected thereto
          (collectively, the “Website”). The following Company privacy policy
          (“Privacy Policy”) is designed to inform you, as a user of the
          Website, about the types of information that Company may gather about
          or collect from you in connection with your use of the Website. It
          also is intended to explain the conditions under which Company uses
          and discloses that information, and your rights in relation to that
          information. Changes to this Privacy Policy are discussed at the end
          of this document. Each time you use the Website, however, the current
          version of this Privacy Policy will apply. Accordingly, each time you
          use the Website you should check the date of this Privacy Policy
          (which appears at the beginning of this document) and review any
          changes since the last time you used the Website.
        </p>
      </Typography>
    </Container>
  );
};

export const Contact = withStyles(styles)(PrivacyView);

export default Contact;

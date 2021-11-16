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

type ClassKey = 'root';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
  });
};

type TermsProps = WithStyles<ClassKey>;

const TermsView = ({ classes }: TermsProps) => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h5">Terms os Service</Typography>
      <Typography>Lorem ipsum ...</Typography>
    </Container>
  );
};

export const Terms = withStyles(styles)(TermsView);

export default Terms;

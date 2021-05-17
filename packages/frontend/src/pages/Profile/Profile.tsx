import React, { useContext, useCallback } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { MyTheme } from 'theme';

type ClassKey = 'root';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
  });
};

type ProfileProps = WithStyles<ClassKey>;

const ProfileView = ({ classes }: ProfileProps) => {
  return <div className={classes.root}>Profile</div>;
};

export const Profile = withStyles(styles)(ProfileView);

export default Profile;

import React, { useContext, useCallback, useState } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { AuthContext } from 'contexts/AuthContext';

import { MyTheme } from 'theme';

type ClassKey = 'root' | 'verify';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
    verify: {
      padding: '30px 0',
      textAlign: 'center',
    },
  });
};

type ProfileProps = WithStyles<ClassKey>;

const ProfileView = ({ classes }: ProfileProps) => {
  const { auth, user } = useContext(AuthContext);
  const [isSent, setIsSent] = useState(false);

  const onSendClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    auth
      .sendVerificationCode()
      .then(() => {
        setIsSent(true);
        console.log('done');
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!user) {
    return null;
  }

  return (
    <>
      <Container maxWidth="lg">
        {user?.isVerified ? (
          <div>Grid</div>
        ) : (
          <Typography className={classes.verify}>
            Please verify your email
            <br /> <br />
            {isSent ? (
              <Button onClick={onSendClick} variant="contained" color="primary">
                Send again
              </Button>
            ) : (
              <Button onClick={onSendClick} variant="contained" color="primary">
                Send code
              </Button>
            )}
          </Typography>
        )}
      </Container>
    </>
  );
};

export const Profile = withStyles(styles)(ProfileView);

export default Profile;

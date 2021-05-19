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
import gpay from 'assets/pay/gpay.png';
import bitpay from 'assets/pay/bitpay.png';
import { AuthContext } from 'contexts/AuthContext';

import { MyTheme } from 'theme';

type ClassKey =
  | 'root'
  | 'verify'
  | 'grid'
  | 'gridItem'
  | 'gridItemTop'
  | 'gridItemBottom';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
    grid: {
      margin: '0 -10px 0 -10px',
      padding: 0,
      listStyle: 'none',
      textAlign: 'center',
    },
    gridItem: {
      display: 'inline-block',
      width: '31%',
      margin: '10px 1%',
      padding: 0,
      border: 'solid 1px #828282',
    },
    gridItemTop: {
      padding: '10px 15px',
      background: '#f2b624',
      textAlign: 'center',
    },
    gridItemBottom: {
      display: 'flex',
      padding: '10px 15px',
      '& > a': {
        width: '50%',
        marginLeft: 5,
      },
      '& > a:first-child': {
        marginLeft: 0,
      },
      '& img': {
        display: 'block',
        width: '100%',
        height: 'auto',
      },
    },
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
  const gridItems = [
    { name: '$100.00', price: '$604.95' },
    { name: '$50.00', price: '$304.95' },
    { name: '$20.00', price: '$124.95' },
    { name: '$10.00', price: '$64.95' },
    { name: '$5.00', price: '$34.95' },
    { name: '$1.00', price: '$10.95' },
  ];
  const onSendClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    auth
      .sendVerificationCode()
      .then(() => {
        setIsSent(true);
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
      <Container maxWidth="xl">
        {user?.isVerified ? (
          <ul className={classes.grid}>
            {gridItems.map(({ name, price }) => (
              <li className={classes.gridItem}>
                <Typography className={classes.gridItemTop} component="div">
                  60-day entry into the {name}
                  <br />
                  Global Money List revolver For {price}
                </Typography>
                <div className={classes.gridItemBottom}>
                  <a href="#">
                    <img src={gpay} alt="gpay" />
                  </a>
                  <a href="#">
                    <img src={bitpay} alt="bitpay" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
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

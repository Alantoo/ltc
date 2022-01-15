import React, { useState, useContext, useCallback } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { AuthContext } from 'contexts/AuthContext';
import { AuthForms } from './AuthForms';
import { MyTheme } from 'theme';

type ClassKey = 'root' | 'holder' | 'card' | 'closeBtn';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
    holder: {
      position: 'relative',
      display: 'flex',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      padding: '37px 24px 22px',
      borderRadius: 15,
      position: 'relative',
      width: '100%',
      maxWidth: 400,
      boxShadow:
        'inset 32.6px -32.6px 32.6px rgba(194, 194, 194, 0.176), inset -32.6px 32.6px 32.6px rgba(255, 255, 255, 0.176)',
      [myTheme.breakpoints.down('sm')]: {
        maxWidth: 500,
        margin: '0 auto',
      },
    },
    closeBtn: {
      position: 'absolute',
      top: 15,
      right: 15,
    },
  });
};

type AuthPopupProps = WithStyles<ClassKey>;

const AuthPopupView = ({ classes }: AuthPopupProps) => {
  const { authModalOpened, setAuthModalOpened } = useContext(AuthContext);
  const opened = Boolean(authModalOpened);

  const onCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setAuthModalOpened(undefined);
    },
    [setAuthModalOpened],
  );

  return (
    <Modal className={classes.root} open={opened}>
      <div className={classes.holder}>
        <Card className={classes.card} elevation={3}>
          <CardContent>
            <AuthForms formType={authModalOpened} />
            <IconButton
              className={classes.closeBtn}
              size="small"
              onClick={onCloseClick}
            >
              <CloseIcon />
            </IconButton>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
};

export const AuthPopup = withStyles(styles)(AuthPopupView);

export default AuthPopup;

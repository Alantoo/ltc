import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { AuthContext } from 'contexts/AuthContext';
import { DataContext } from 'contexts/DataContext';
import { MyTheme } from 'theme';

type ClassKey =
  | 'root'
  | 'loading'
  | 'form'
  | 'row'
  | 'cell'
  | 'label'
  | 'buttons'
  | 'errors';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
    loading: {
      padding: 30,
      textAlign: 'center',
    },
    form: {
      width: '100%',
      padding: '20px 0',
      maxWidth: 600,
      margin: '0 auto',
    },
    row: {
      display: 'flex',
      justifyContent: 'stretch',
      alignItems: 'flex-end',
      paddingBottom: 10,
    },
    cell: {
      flexGrow: 1,
      width: '70%',
      '&:first-child': {
        width: '30%',
      },
    },
    label: {
      textAlign: 'right',
      paddingRight: 15,
      paddingBottom: 4,
    },
    buttons: {
      textAlign: 'center',
      '& button': {
        margin: '0 5px',
        paddingTop: 4,
        paddingBottom: 4,
      },
    },
    errors: {
      textAlign: 'center',
      paddingBottom: 10,
      color: 'red',
    },
  });
};

type SettingsProps = WithStyles<ClassKey>;

const SettingsView = ({ classes }: SettingsProps) => {
  const { auth, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [error, setError] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [name] = useState(user ? user.name : '');
  const [password, setPassword] = useState('');
  const [passwordProps] = useState<any>({
    autocomplete: 'new-password',
    form: {
      autocomplete: 'off',
    },
  });

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    setError('');
    auth
      .updateInfo({ email, password })
      .then(() => {
        setPassword('');
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSendClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (loading) {
        return;
      }
      setLoading(true);
      auth
        .sendVerificationCode()
        .then(() => {
          setIsSent(true);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [auth, setIsSent],
  );

  const onEmailChange = (e: React.FormEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const val = e.target.value as string;
    setEmail(val);
    setError('');
  };

  const onPasswordChange = (e: React.FormEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const val = e.target.value as string;
    setPassword(val);
    setError('');
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <div>
        <Typography variant="h5">Account Settings</Typography>
        <form action="#" className={classes.form} onSubmit={onFormSubmit}>
          <div className={classes.row}>
            <div className={classes.cell}>
              <Typography className={classes.label}>
                <label htmlFor="accountName">Account Name</label>
              </Typography>
            </div>
            <div className={classes.cell}>
              <TextField
                id="accountName"
                name="accountName"
                placeholder="account name"
                value={name}
                fullWidth
                disabled
              />
            </div>
          </div>

          {/*<div className={classes.row}>*/}
          {/*  <div className={classes.cell}>*/}
          {/*    <Typography className={classes.label}>*/}
          {/*      <label htmlFor="firstName">First Name</label>*/}
          {/*    </Typography>*/}
          {/*  </div>*/}
          {/*  <div className={classes.cell}>*/}
          {/*    <TextField*/}
          {/*      id="firstName"*/}
          {/*      name="firstName"*/}
          {/*      placeholder="First Name"*/}
          {/*      fullWidth*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className={classes.row}>*/}
          {/*  <div className={classes.cell}>*/}
          {/*    <Typography className={classes.label}>*/}
          {/*      <label htmlFor="lastName">Last Name</label>*/}
          {/*    </Typography>*/}
          {/*  </div>*/}
          {/*  <div className={classes.cell}>*/}
          {/*    <TextField*/}
          {/*      id="lastName"*/}
          {/*      name="lastName"*/}
          {/*      placeholder="Last Name"*/}
          {/*      fullWidth*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className={classes.row}>
            <div className={classes.cell}>
              <Typography className={classes.label}>
                <label htmlFor="filled-full-width">Email Address</label>
              </Typography>
            </div>
            <div className={classes.cell}>
              <TextField
                id="email"
                name="email"
                value={email}
                onChange={onEmailChange}
                placeholder="email address"
                fullWidth
              />
            </div>
          </div>

          <div className={classes.row}>
            <div className={classes.cell}>
              <Typography className={classes.label}>
                <label htmlFor="no-password">Password</label>
              </Typography>
            </div>
            <div className={classes.cell}>
              <TextField
                id="no-password"
                name="no-password"
                value={password}
                onChange={onPasswordChange}
                placeholder="password"
                type="password"
                fullWidth
                inputProps={passwordProps}
              />
            </div>
          </div>

          {error ? (
            <Typography className={classes.errors}>{error}</Typography>
          ) : null}

          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              type="submit"
            >
              Save
            </Button>
            {user.isVerified ? null : (
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={onSendClick}
              >
                {isSent ? 'Send again' : 'Verify email'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
};

export const Settings = withStyles(styles)(SettingsView);

export default Settings;

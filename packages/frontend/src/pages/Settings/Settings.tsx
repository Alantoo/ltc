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
import { MyTheme } from 'theme';

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const btcAddrRegExp = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/i;

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
  const [firstName, setFirstName] = useState(user ? user.firstName : '');
  const [lastName, setLastName] = useState(user ? user.lastName : '');
  const [btcAddress, setBtcAddress] = useState(user ? user.btcAddress : '');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordProps] = useState<any>({
    autoComplete: 'new-password',
    form: {
      autoComplete: 'off',
    },
  });

  useEffect(() => {
    setEmail(user ? user.email : '');
    setFirstName(user ? user.firstName : '');
    setLastName(user ? user.lastName : '');
    setBtcAddress(user ? user.btcAddress : '');
  }, [user]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) {
      return;
    }

    if (!emailRegExp.test(email)) {
      setError('Email incorrect');
      return;
    }

    if (!btcAddrRegExp.test(btcAddress)) {
      setError('BTC wallet address incorrect');
      return;
    }

    if (password !== password2) {
      setError('Password mismatch');
      return;
    }

    setLoading(true);
    setError('');
    auth
      .updateInfo({ email, password, firstName, lastName, btcAddress })
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

  const onFirstNameChange = (e: React.FormEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const val = e.target.value as string;
    setFirstName(val);
    setError('');
  };

  const onLastNameChange = (e: React.FormEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const val = e.target.value as string;
    setLastName(val);
    setError('');
  };

  const onPasswordChange = (e: React.FormEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const val = e.target.value as string;
    setPassword(val);
    setError('');
  };

  const onPassword2Change = (e: React.FormEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const val = e.target.value as string;
    setPassword2(val);
    setError('');
  };

  const onBtcAddressChange = (e: React.FormEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const val = e.target.value as string;
    setBtcAddress(val);
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

          <div className={classes.row}>
            <div className={classes.cell}>
              <Typography className={classes.label}>
                <label htmlFor="firstName">First Name</label>
              </Typography>
            </div>
            <div className={classes.cell}>
              <TextField
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={onFirstNameChange}
                fullWidth
              />
            </div>
          </div>

          <div className={classes.row}>
            <div className={classes.cell}>
              <Typography className={classes.label}>
                <label htmlFor="lastName">Last Name</label>
              </Typography>
            </div>
            <div className={classes.cell}>
              <TextField
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={onLastNameChange}
                fullWidth
              />
            </div>
          </div>

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
                <label htmlFor="filled-full-width">BTC wallet Address</label>
              </Typography>
            </div>
            <div className={classes.cell}>
              <TextField
                id="btcAddress"
                name="btcAddress"
                value={btcAddress}
                onChange={onBtcAddressChange}
                placeholder="wallet address"
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

          <div className={classes.row}>
            <div className={classes.cell}>
              <Typography className={classes.label}>
                <label htmlFor="no-password2">Confirm Password</label>
              </Typography>
            </div>
            <div className={classes.cell}>
              <TextField
                id="no-password2"
                name="no-password2"
                value={password2}
                onChange={onPassword2Change}
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

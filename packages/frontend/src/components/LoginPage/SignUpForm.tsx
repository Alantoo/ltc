import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MyTheme } from 'theme';

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const nameRegExp = /^[a-zA-Z0-9]+$/i;

type ClassKey =
  | 'form'
  | 'formTitle'
  | 'field'
  | 'formError'
  | 'button'
  | 'links'
  | 'terms';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    form: {
      width: '100%',
      display: 'none',
      '&.active': {
        display: 'block',
      },
    },
    formTitle: {
      marginBottom: 10,
    },
    field: {
      width: '100%',
      marginBottom: 12,
    },
    formError: {
      color: myTheme.palette.error.main,
    },
    button: {
      width: '100%',
      marginBottom: 10,
      marginTop: 10,
    },
    links: {
      textAlign: 'center',
    },
    terms: {
      marginTop: 5,
      marginBottom: 10,
      '& span': {
        lineHeight: '17px',
      },
      '& .text': {
        fontSize: 14,
      },
    },
  });
};

type SignUpFormProps = WithStyles<ClassKey> & {
  active: boolean;
  loading: boolean;
  error: string;
  onFormSubmit: (data: {
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => void;
  onLoginClick: () => void;
};

const SignUpFormView = (props: SignUpFormProps) => {
  const { classes, error: initError, active, loading } = props;
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState(initError);
  const [passwordProps] = useState<any>({
    autoComplete: 'new-password',
    form: {
      autoComplete: 'off',
    },
  });

  useEffect(() => {
    setError(initError);
  }, [initError]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      return;
    }
    if (!email) {
      setError('Email required');
      return;
    }
    if (!emailRegExp.test(email)) {
      setError('Email incorrect');
      return;
    }
    if (!name) {
      setError('Name required');
      return;
    }
    if (!nameRegExp.test(name)) {
      setError('Name incorrect');
      return;
    }
    if (!password) {
      setError('Password required');
      return;
    }
    if (password !== password2) {
      setError('Password mismatch');
      return;
    }
    props.onFormSubmit({ email, name, firstName, lastName, password });
  };

  const onLoginClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      props.onLoginClick();
    },
    [props.onLoginClick],
  );

  const onNameChange = useCallback(
    (e) => {
      const value = e.target.value;
      setName(value);
      setError('');
    },
    [setName, setError],
  );

  const onFirstNameChange = useCallback(
    (e) => {
      const value = e.target.value;
      setFirstName(value);
      setError('');
    },
    [setFirstName, setError],
  );

  const onLastNameChange = useCallback(
    (e) => {
      const value = e.target.value;
      setLastName(value);
      setError('');
    },
    [setLastName, setError],
  );

  const onEmailChange = useCallback(
    (e) => {
      const value = e.target.value;
      setEmail(value);
      setError('');
    },
    [setEmail, setError],
  );

  const onPasswordChange = useCallback(
    (e) => {
      const value = e.target.value;
      setPassword(value);
      setError('');
    },
    [setPassword, setError],
  );

  const onPassword2Change = useCallback(
    (e) => {
      const value = e.target.value;
      setPassword2(value);
      setError('');
    },
    [setPassword2, setError],
  );

  const onTermsChange = (e: React.ChangeEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setTerms(e.target.checked);
  };

  return (
    <form
      onSubmit={onFormSubmit}
      className={`${classes.form} ${active ? 'active' : ''}`}
      noValidate
      autoComplete="off"
    >
      <Typography className={classes.formTitle} variant="subtitle1">
        Register
      </Typography>
      <div>
        <FormControl className={classes.field}>
          <TextField
            id="sign-up-name"
            name="sign-up-name"
            label="Name"
            value={name}
            onChange={onNameChange}
            helperText="You can use upper- and lower-case letters or numbers only. Your username will be shown in your affiliate URL."
            fullWidth
            autoComplete="off"
          />
        </FormControl>
      </div>
      <div>
        <FormControl className={classes.field}>
          <TextField
            id="sign-up-firstName"
            name="sign-up-firstName"
            label="First Name"
            value={firstName}
            onChange={onFirstNameChange}
            fullWidth
            autoComplete="off"
          />
        </FormControl>
      </div>
      <div>
        <FormControl className={classes.field}>
          <TextField
            id="sign-up-lastName"
            name="sign-up-lastName"
            label="Last Name"
            value={lastName}
            onChange={onLastNameChange}
            fullWidth
            autoComplete="off"
          />
        </FormControl>
      </div>
      <div>
        <FormControl className={classes.field}>
          <TextField
            id="sign-up-email"
            name="sign-up-email"
            label="Email"
            value={email}
            onChange={onEmailChange}
            fullWidth
            autoComplete="off"
          />
        </FormControl>
      </div>
      <div>
        <FormControl className={classes.field}>
          <TextField
            id="sign-up-password"
            name="sign-up-password"
            label="Password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            inputProps={passwordProps}
            helperText="Use up to 20 characters with a mix of letters, numbers and symbols."
            fullWidth
          />
        </FormControl>
      </div>
      <div>
        <FormControl className={classes.field}>
          <TextField
            id="sign-up-password2"
            name="sign-up-password2"
            label="Confirm Password"
            type="password"
            value={password2}
            onChange={onPassword2Change}
            inputProps={passwordProps}
            fullWidth
          />
        </FormControl>
      </div>
      <div className={classes.terms}>
        <FormControlLabel
          control={
            <Checkbox
              checked={terms}
              color="primary"
              onChange={onTermsChange}
              name="checkedA"
            />
          }
          label={
            <span className="text">
              Click box if you agree with Global Money List{' '}
              <Link to="/terms" target="_blank">
                Terms of Service
              </Link>
            </span>
          }
        />
      </div>
      {error ? (
        <Typography className={classes.formError} variant="body2">
          {error}
        </Typography>
      ) : null}
      <div>
        <Button
          variant="contained"
          type="submit"
          disabled={loading || !terms}
          className={classes.button}
        >
          Sign up
        </Button>
      </div>
      <div className={classes.links}>
        <a href="#" onClick={onLoginClick}>
          Login
        </a>
      </div>
    </form>
  );
};

export const SignUpForm = withStyles(styles)(SignUpFormView);

export default SignUpForm;

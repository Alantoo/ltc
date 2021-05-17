import React, { useState, useEffect, useCallback } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MyTheme } from 'theme';

type ClassKey =
  | 'form'
  | 'formTitle'
  | 'field'
  | 'formError'
  | 'button'
  | 'links';

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
  });
};

type SignUpFormProps = WithStyles<ClassKey> & {
  active: boolean;
  loading: boolean;
  error: string;
  onFormSubmit: (data: {
    email: string;
    name: string;
    password: string;
  }) => void;
  onLoginClick: () => void;
};

const SignUpFormView = (props: SignUpFormProps) => {
  const { classes, error: initError, active, loading } = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initError);

  useEffect(() => {
    setError(initError);
  }, [initError]);

  const onFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      props.onFormSubmit({ email, name, password });
    },
    [email, password, name, props.onFormSubmit],
  );

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
            fullWidth
          />
        </FormControl>
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
          disabled={loading}
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

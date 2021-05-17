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
      marginBottom: 5,
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

type LoginFormProps = WithStyles<ClassKey> & {
  active: boolean;
  loading: boolean;
  error: string;
  onFormSubmit: (data: { email: string; password: string }) => void;
  onRegisterClick: () => void;
};

const LoginFormView = (props: LoginFormProps) => {
  const { classes, error: initError, active, loading } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initError);

  useEffect(() => {
    setError(initError);
  }, [initError]);

  const onFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      props.onFormSubmit({ email, password });
    },
    [email, password, props.onFormSubmit],
  );

  const onRegisterClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      props.onRegisterClick();
    },
    [props.onRegisterClick],
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
        Login
      </Typography>
      <div>
        <FormControl className={classes.field}>
          <TextField
            id="login-email"
            name="login-email"
            label="E-mail"
            value={email}
            onChange={onEmailChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </FormControl>
      </div>
      <div>
        <FormControl className={classes.field}>
          <TextField
            id="login-password"
            name="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            InputLabelProps={{ shrink: true }}
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
          Sign in
        </Button>
      </div>
      <div className={classes.links}>
        <a href="#" onClick={onRegisterClick}>
          Register
        </a>
      </div>
    </form>
  );
};

export const LoginForm = withStyles(styles)(LoginFormView);

export default LoginForm;

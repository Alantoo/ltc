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
  | 'formMessage'
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
    formMessage: {
      color: myTheme.palette.success.main,
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

type ForgotPasswordFormProps = WithStyles<ClassKey> & {
  active: boolean;
  loading: boolean;
  error: string;
  message: string;
  onFormSubmit: (data: { email: string }) => void;
  onLoginClick: () => void;
};

const ForgotPasswordFormView = (props: ForgotPasswordFormProps) => {
  const {
    classes,
    error: initError,
    message: initMessage,
    active,
    loading,
  } = props;
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(initMessage);
  const [error, setError] = useState(initError);

  useEffect(() => {
    setMessage(initMessage);
  }, [initMessage]);

  useEffect(() => {
    setError(initError);
  }, [initError]);

  const onFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      props.onFormSubmit({ email });
    },
    [email, props.onFormSubmit],
  );

  const onLoginClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      props.onLoginClick();
    },
    [props.onLoginClick],
  );

  const onEmailChange = useCallback(
    (e) => {
      const value = e.target.value;
      setEmail(value);
      setMessage('');
      setError('');
    },
    [setEmail, setMessage, setError],
  );

  return (
    <form
      onSubmit={onFormSubmit}
      className={`${classes.form} ${active ? 'active' : ''}`}
      noValidate
      autoComplete="off"
    >
      <Typography className={classes.formTitle} variant="subtitle1">
        Forgot Password
      </Typography>
      <div>
        <FormControl className={classes.field}>
          <TextField
            id="email"
            name="email"
            label="E-mail"
            value={email}
            onChange={onEmailChange}
            autoComplete="on"
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
      {message ? (
        <Typography className={classes.formMessage} variant="body2">
          {message}
        </Typography>
      ) : null}
      <div>
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          className={classes.button}
        >
          Send email
        </Button>
      </div>
      <div className={classes.links}>
        <a href="#" onClick={onLoginClick}>
          Go back to login
        </a>
      </div>
    </form>
  );
};

export const ForgotPasswordForm = withStyles(styles)(ForgotPasswordFormView);

export default ForgotPasswordForm;

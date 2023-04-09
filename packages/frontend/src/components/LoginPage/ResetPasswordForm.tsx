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

type ResetPasswordFormProps = WithStyles<ClassKey> & {
  active: boolean;
  loading: boolean;
  error: string;
  onFormSubmit: (data: { password: string }) => void;
  onLoginClick: () => void;
};

const ResetPasswordFormView = (props: ResetPasswordFormProps) => {
  const { classes, error: initError, active, loading } = props;
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
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

  const onFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!password) {
        setError('Password required');
        return;
      }
      if (password !== password2) {
        setError('Password mismatch');
        return;
      }
      props.onFormSubmit({ password });
    },
    [password, password2, setError, props.onFormSubmit],
  );

  const onLoginClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      props.onLoginClick();
    },
    [props.onLoginClick],
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

  return (
    <form
      onSubmit={onFormSubmit}
      className={`${classes.form} ${active ? 'active' : ''}`}
      noValidate
      autoComplete="off"
    >
      <Typography className={classes.formTitle} variant="subtitle1">
        Reset Password
      </Typography>
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
          Update password
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

export const ResetPasswordForm = withStyles(styles)(ResetPasswordFormView);

export default ResetPasswordForm;

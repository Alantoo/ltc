import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { MyTheme } from 'theme';
import { SignUpForm } from './SignUpForm';
import { LoginForm } from './LoginForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { AuthContext } from 'contexts/AuthContext';

export const formTypes = {
  SIGN_UP: 'signUp',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgotPassword',
  RESET_PASSWORD: 'resetPassword',
};

type ClassKey = 'root';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
  });
};

type AuthFormsProps = WithStyles<ClassKey> & {
  formType?: string;
};

const AuthFormsView = (props: AuthFormsProps) => {
  const { classes, formType: initFormType = formTypes.LOGIN } = props;
  const history = useHistory();
  const { search } = useLocation();
  const { auth } = useContext(AuthContext);

  const [formType, setFormType] = useState<string>(initFormType);
  const [loading, setLoading] = useState(false);

  const [signUpFormError, setSignUpFormError] = useState('');
  const [loginFormError, setLoginFormError] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  useEffect(() => {
    setFormType(props.formType || formTypes.LOGIN);
  }, [props.formType, setFormType]);

  const onRegisterClick = useCallback(() => {
    history.push('/register');
    // setFormType(formTypes.SIGN_UP);
  }, [setFormType]);

  const onLoginClick = useCallback(() => {
    history.push('/login');
    // setFormType(formTypes.LOGIN);
  }, [setFormType]);

  const onForgotPasswordClick = useCallback(() => {
    history.push('/forgot-password');
    // setFormType(formTypes.LOGIN);
  }, [setFormType]);

  const onLoginFormSubmit = useCallback(
    ({ email, password }) => {
      setLoading(true);
      setLoginFormError('');

      auth
        .login({
          email,
          password,
        })
        .then(() => {
          history.push('/profile');
        })
        .catch((err) => {
          setLoginFormError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setLoginFormError, setLoading],
  );

  const onSignUpFormSubmit = useCallback(
    ({ email, name, firstName, lastName, password, btcAddress }) => {
      setLoading(true);
      setSignUpFormError('');

      auth
        .register({
          email,
          password,
          name,
          firstName,
          lastName,
          btcAddress,
        })
        .then(() => {
          history.push('/profile');
        })
        .catch((err) => {
          setSignUpFormError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [history, setSignUpFormError, setLoading],
  );

  const onForgotPasswordFormSubmit = useCallback(
    ({ email }) => {
      setLoading(true);
      setForgotPasswordMessage('');
      setForgotPasswordError('');

      auth
        .forgotPassword({ email })
        .then(() => {
          setForgotPasswordMessage('Password reset request sent to your email');
        })
        .catch((err) => {
          setForgotPasswordError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setForgotPasswordMessage, setForgotPasswordError, setLoading],
  );

  const onResetPasswordFormSubmit = useCallback(
    ({ password }) => {
      setLoading(true);
      setResetPasswordError('');

      const searchParams = new URLSearchParams(search);
      const userId = searchParams.get('userId') || '';
      const token = searchParams.get('token') || '';

      auth
        .resetPassword({ password, userId, token })
        .then(() => {
          history.push('/profile');
        })
        .catch((err) => {
          setResetPasswordError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setForgotPasswordMessage, setForgotPasswordError, setLoading],
  );

  return (
    <div className={`${classes.root} auth-forms`}>
      {/*@ts-ignore*/}
      <SignUpForm
        active={formType === formTypes.SIGN_UP}
        loading={loading}
        error={signUpFormError}
        onFormSubmit={onSignUpFormSubmit}
        onLoginClick={onLoginClick}
      />

      {/*@ts-ignore*/}
      <LoginForm
        active={formType === formTypes.LOGIN}
        loading={loading}
        error={loginFormError}
        onFormSubmit={onLoginFormSubmit}
        onForgotPasswordClick={onForgotPasswordClick}
        onRegisterClick={onRegisterClick}
      />

      {/*@ts-ignore*/}
      <ForgotPasswordForm
        active={formType === formTypes.FORGOT_PASSWORD}
        loading={loading}
        error={forgotPasswordError}
        message={forgotPasswordMessage}
        onFormSubmit={onForgotPasswordFormSubmit}
        onLoginClick={onLoginClick}
      />

      {/*@ts-ignore*/}
      <ResetPasswordForm
        active={formType === formTypes.RESET_PASSWORD}
        loading={loading}
        error={resetPasswordError}
        onFormSubmit={onResetPasswordFormSubmit}
        onLoginClick={onLoginClick}
      />
    </div>
  );
};

export const AuthForms = withStyles(styles)(AuthFormsView);

export default AuthForms;

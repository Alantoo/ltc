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
import { ForgetPasswordForm } from './ForgetPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { AuthContext } from 'contexts/AuthContext';

export const formTypes = {
  SIGN_UP: 'signUp',
  LOGIN: 'login',
  FORGET_PASSWORD: 'forgetPassword',
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
  const [forgetPasswordError, setForgetPasswordError] = useState('');
  const [forgetPasswordMessage, setForgetPasswordMessage] = useState('');

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

  const onForgetPasswordClick = useCallback(() => {
    history.push('/forget-password');
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

  const onForgetPasswordFormSubmit = useCallback(
    ({ email }) => {
      setLoading(true);
      setForgetPasswordMessage('');
      setForgetPasswordError('');

      auth
        .forgetPassword({ email })
        .then(() => {
          setForgetPasswordMessage('Password reset request sent to your email');
        })
        .catch((err) => {
          setForgetPasswordError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setForgetPasswordMessage, setForgetPasswordError, setLoading],
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
    [setForgetPasswordMessage, setForgetPasswordError, setLoading],
  );

  return (
    <div className={`${classes.root} auth-forms`}>
      <SignUpForm
        active={formType === formTypes.SIGN_UP}
        loading={loading}
        error={signUpFormError}
        onFormSubmit={onSignUpFormSubmit}
        onLoginClick={onLoginClick}
      />

      <LoginForm
        active={formType === formTypes.LOGIN}
        loading={loading}
        error={loginFormError}
        onFormSubmit={onLoginFormSubmit}
        onForgetPasswordClick={onForgetPasswordClick}
        onRegisterClick={onRegisterClick}
      />

      <ForgetPasswordForm
        active={formType === formTypes.FORGET_PASSWORD}
        loading={loading}
        error={forgetPasswordError}
        message={forgetPasswordMessage}
        onFormSubmit={onForgetPasswordFormSubmit}
        onLoginClick={onLoginClick}
      />

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

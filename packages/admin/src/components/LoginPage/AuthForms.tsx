import React, { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { MyTheme } from 'theme';
import { SignUpForm } from './SignUpForm';
import { LoginForm } from './LoginForm';
import { AuthContext } from 'contexts/AuthContext';

const formTypes = {
  SIGN_UP: 'signUp',
  LOGIN: 'login',
  NEW_PASSWORD: 'newPassword',
  FORGOT_PASSWORD: 'forgotPassword',
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

type AuthFormsProps = WithStyles<ClassKey>;

const AuthFormsView = (props: AuthFormsProps) => {
  const { classes } = props;
  const history = useHistory();
  const { auth } = useContext(AuthContext);

  const [formType, setFormType] = useState(formTypes.LOGIN);
  const [loading, setLoading] = useState(false);

  const [signUpFormError, setSignUpFormError] = useState('');
  const [loginFormError, setLoginFormError] = useState('');

  const onRegisterClick = useCallback(() => {
    setFormType(formTypes.SIGN_UP);
  }, [setFormType]);

  const onLoginClick = useCallback(() => {
    setFormType(formTypes.LOGIN);
  }, [setFormType]);

  const onLoginFormSubmit = useCallback(
    ({ email, password }) => {
      setLoading(true);

      auth
        .login({
          email,
          password,
        })
        .then(() => {
          history.push('/');
        })
        .catch((err) => {
          setLoginFormError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setLoading],
  );

  const onSignUpFormSubmit = useCallback(
    ({ email, name, password, firstName, lastName }) => {
      setLoading(true);

      auth
        .register({
          email,
          password,
          name,
          firstName,
          lastName,
        })
        .then(() => {
          history.push('/');
        })
        .catch((err) => {
          setSignUpFormError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [history, setLoading],
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
        onRegisterClick={onRegisterClick}
      />
    </div>
  );
};

export const AuthForms = withStyles(styles)(AuthFormsView);

export default AuthForms;

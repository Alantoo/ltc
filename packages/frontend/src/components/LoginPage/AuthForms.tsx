import React, { useState, useCallback, useContext, useEffect } from 'react';
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

export const formTypes = {
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

type AuthFormsProps = WithStyles<ClassKey> & {
  formType?: string;
};

const AuthFormsView = (props: AuthFormsProps) => {
  const { classes, formType: initFormType = formTypes.LOGIN } = props;
  const history = useHistory();
  const { auth } = useContext(AuthContext);

  const [formType, setFormType] = useState<string>(initFormType);
  const [loading, setLoading] = useState(false);

  const [signUpFormError, setSignUpFormError] = useState('');
  const [loginFormError, setLoginFormError] = useState('');

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

  const onLoginFormSubmit = useCallback(
    ({ email, password }) => {
      setLoading(true);

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
    [setLoading],
  );

  const onSignUpFormSubmit = useCallback(
    ({ email, name, firstName, lastName, password }) => {
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
          history.push('/profile');
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

import React, { useState, useCallback, useContext } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { MyTheme } from 'theme';
// import { SignUpForm } from './SignUpForm';
import { LoginForm } from './LoginForm';
// import { NewPasswordForm } from './NewPasswordForm';
// import { ForgotPasswordForm } from './ForgotPasswordForm';
import { AuthContext } from 'contexts/AuthContext';
import { useLogin } from 'react-admin';

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
    },
  });
};

type AuthFormsProps = WithStyles<ClassKey>;

const AuthFormsView = (props: AuthFormsProps) => {
  const { classes } = props;
  const { auth } = useContext(AuthContext);
  const login = useLogin();

  const [tempUser, setTempUser] = useState();
  const [formType, setFormType] = useState(formTypes.LOGIN);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signUpFormError, setSignUpFormError] = useState('');
  const [loginFormError, setLoginFormError] = useState('');
  const [forgotFormError, setForgotFormError] = useState('');
  const [newFormError, setNewFormError] = useState('');

  const onLoginFormSubmit = useCallback(
    ({ email, password }) => {
      setLoading(true);

      login(
        {
          email,
          password,
        },
        '/',
      )
        // .then(() => {})
        .finally(() => {
          setLoading(false);
        });

      // auth.Auth.signIn(email, password)
      //   .then((user) => {
      //     if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      //       // set password on first login
      //       setEmail(email);
      //       setTempUser(user);
      //       setFormType(formTypes.NEW_PASSWORD);
      //       setLoading(false);
      //       return;
      //     }
      //     // login
      //     auth.login({
      //       email: email,
      //       password: password,
      //     });
      //   })
      //   .catch((err) => {
      //     if (err.code === 'PasswordResetRequiredException') {
      //       setEmail(email);
      //       setForgotFormError(err.message);
      //       setFormType(formTypes.FORGOT_PASSWORD);
      //     }
      //     setLoginFormError(err.message);
      //     setLoading(false);
      //   });
    },
    [setTempUser, setEmail, setFormType, setLoading],
  );

  // const onNewPasswordFormSubmit = useCallback(
  //   ({ newPassword }) => {
  //     // setLoading(true);
  //     auth.Auth.completeNewPassword(tempUser, newPassword)
  //       .then(() => {
  //         // login
  //         auth.login({
  //           email: email,
  //           password: newPassword,
  //         });
  //       })
  //       .catch((err) => {
  //         if (err.code === 'PasswordResetRequiredException') {
  //           setFormType(formTypes.FORGOT_PASSWORD);
  //         }
  //         setNewFormError(err.message);
  //       });
  //   },
  //   [auth, email, tempUser, setFormType, setNewFormError],
  // );
  //
  // const onForgotPasswordFormSubmit = useCallback(
  //   ({ email, code, newPassword }) => {
  //     setLoading(true);
  //     auth.Auth.forgotPasswordSubmit(email, code, newPassword)
  //       .then(() => {
  //         // login
  //         auth.login({
  //           email: email,
  //           password: newPassword,
  //         });
  //       })
  //       .catch((err) => {
  //         setForgotFormError(err.message);
  //         setLoading(false);
  //       });
  //   },
  //   [auth, setLoading, setForgotFormError],
  // );
  //
  // const onForgotPasswordSendCodeClick = useCallback(
  //   ({ email }) => {
  //     auth.Auth.forgotPassword(email).catch((err) => {
  //       setForgotFormError(err.message);
  //     });
  //   },
  //   [auth, setForgotFormError],
  // );
  //
  // const onFacebookClick = useCallback(() => {
  //   auth.login({ provider: auth.IdentityProvider.Facebook });
  //
  //   setLoading(true);
  //   setLoadingFacebook(true);
  // }, [auth, setLoading, setLoadingFacebook]);
  //
  // const onGoogleClick = useCallback(() => {
  //   auth.login({ provider: auth.IdentityProvider.Google });
  //
  //   setLoading(true);
  //   setLoadingGoogle(true);
  // }, [auth, setLoading, setLoadingGoogle]);

  return (
    <div className={`${classes.root} auth-forms`}>
      {/*<SignUpForm*/}
      {/*  active={formType === formTypes.SIGN_UP}*/}
      {/*  loading={loading}*/}
      {/*  error={signUpFormError}*/}
      {/*  onFormSubmit={onSignUpFormSubmit}*/}
      {/*/>*/}

      <LoginForm
        active={formType === formTypes.LOGIN}
        loading={loading}
        error={loginFormError}
        onFormSubmit={onLoginFormSubmit}
      />

      {/*<NewPasswordForm*/}
      {/*  active={formType === formTypes.NEW_PASSWORD}*/}
      {/*  loading={loading}*/}
      {/*  error={newFormError}*/}
      {/*  onFormSubmit={onNewPasswordFormSubmit}*/}
      {/*/>*/}

      {/*<ForgotPasswordForm*/}
      {/*  active={formType === formTypes.FORGOT_PASSWORD}*/}
      {/*  email={email}*/}
      {/*  loading={loading}*/}
      {/*  error={forgotFormError}*/}
      {/*  onSendCodeClick={onForgotPasswordSendCodeClick}*/}
      {/*  onFormSubmit={onForgotPasswordFormSubmit}*/}
      {/*/>*/}

      {/*<LoginButtons*/}
      {/*  active*/}
      {/*  loading={loading}*/}
      {/*  loadingFacebook={loadingFacebook}*/}
      {/*  loadingGoogle={loadingGoogle}*/}
      {/*  onFacebookClick={onFacebookClick}*/}
      {/*  onGoogleClick={onGoogleClick}*/}
      {/*/>*/}
    </div>
  );
};

export const AuthForms = withStyles(styles)(AuthFormsView);

export default AuthForms;

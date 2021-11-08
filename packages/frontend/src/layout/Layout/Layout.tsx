import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from 'react-router-dom';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { ScrollToTop } from 'components/ScrollToTop';
import { AuthPopup } from 'components/LoginPage';
import { Header } from 'layout/Header';
import { Footer } from 'layout/Footer';
import { Home } from 'pages/Home';
import { Profile } from 'pages/Profile';
import { Referrals } from 'pages/Referrals';
import { Earnings } from 'pages/Earnings';
import { AuthContext } from 'contexts/AuthContext';
import { MyTheme } from 'theme';

type ClassKey = 'root' | 'loading';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {
      display: 'block',
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 30,
    },
  });
};

type PrivateOrPublicRouteProps = RouteProps &
  WithStyles<ClassKey> & {
    children: React.ReactElement;
    privateRedirect?: string | undefined;
    publicRedirect?: string | undefined;
  };

function PrivateOrPublicRoute({
  classes,
  children,
  privateRedirect,
  publicRedirect,
  ...rest
}: PrivateOrPublicRouteProps) {
  const { user, loading } = useContext(AuthContext);

  const isPrivateRoute = !privateRedirect;
  const redirect = isPrivateRoute ? publicRedirect : privateRedirect;

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (loading) {
          return <div className={classes.loading}>Loading...</div>;
        }
        return (isPrivateRoute && user) || (!isPrivateRoute && !user) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirect,
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

type LayoutProps = WithStyles<ClassKey>;

const LayoutView = ({ classes }: LayoutProps) => {
  return (
    <>
      <Switch>
        <Route path="/" exact>
          <Header />
          <Home />
          <Footer />
        </Route>

        <PrivateOrPublicRoute classes={classes} publicRedirect="/" path="/">
          <>
            <div>
              <Header />
              <Switch>
                <Route path="/profile/" component={Profile} exact />
                <Route path="/profile/referrals/" component={Referrals} />
                <Route path="/profile/rewards/" component={Earnings} />
              </Switch>
            </div>
            <Footer />
          </>
        </PrivateOrPublicRoute>
      </Switch>
      <ScrollToTop />
      <AuthPopup />
    </>
  );
};

export const Layout = withStyles(styles)(LayoutView);

export default Layout;

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
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
import { History } from 'pages/History';
import { Settings } from 'pages/Settings';
import { Terms } from 'pages/Terms';
import { FAQ } from 'pages/FAQ';
import { Contact } from 'pages/Contact';
import { Login } from 'pages/Login';
import { Register } from 'pages/Register';
import { ForgotPassword } from 'pages/ForgotPassword';
import { MyTheme } from 'theme';
import About from 'pages/About/About';
import Privacy from 'pages/Privacy/Privacy';

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

type LayoutProps = WithStyles<ClassKey>;

const LayoutView = ({ classes }: LayoutProps) => {
  return (
    <>
      <div className="layout-body">
        {/*@ts-ignore*/}
        <Header />
        <Switch>
          {/*@ts-ignore*/}
          <Route path="/" component={Home} exact />
          {/*@ts-ignore*/}
          <Route path="/terms/" component={Terms} />
          <Route path="/privacy/" component={Privacy} />
          <Route path="/faqs/" component={FAQ} />
          {/*@ts-ignore*/}
          <Route path="/contact/" component={Contact} />
          {/*@ts-ignore*/}
          <Route path="/profile/" component={Profile} exact />
          {/*@ts-ignore*/}
          <Route path="/profile/referrals/" component={Referrals} />
          {/*@ts-ignore*/}
          <Route path="/profile/rewards/" component={Earnings} />
          {/*@ts-ignore*/}
          <Route path="/profile/history/" component={History} />
          {/*@ts-ignore*/}
          <Route path="/profile/settings/" component={Settings} />
          {/*@ts-ignore*/}
          <Route path="/login/" component={Login} />
          {/*@ts-ignore*/}
          <Route path="/register/" component={Register} />
          {/*@ts-ignore*/}
          <Route path="/forgot-password/" component={ForgotPassword} />
          <Route path="/about/" component={About} />
          <Redirect to="/" />
        </Switch>
      </div>
      <Footer />
      {/*@ts-ignore*/}
      <ScrollToTop />
      {/*@ts-ignore*/}
      <AuthPopup />
    </>
  );
};

export const Layout = withStyles(styles)(LayoutView);

export default Layout;

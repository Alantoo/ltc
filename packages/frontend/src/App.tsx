import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Layout } from 'layout/Layout';
import { AuthContextProvider } from 'contexts/AuthContext';
import { DataContextProvider } from 'contexts/DataContext';
import { authProvider } from './authProvider';
import { DataProvider } from './dataProvider';
import { theme } from 'theme';

const dataProvider = new DataProvider({ authProvider });

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  let basename = '';
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    basename = (document.cookie || '')
      .split('; ')
      .find((row) => row.startsWith('basename='))
      .split('=')[1];
  } catch (err) {}

  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider auth={authProvider}>
        <DataContextProvider dataProvider={dataProvider}>
          <Router basename={basename}>
            <ScrollToTop />
            <Layout />
          </Router>
        </DataContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;

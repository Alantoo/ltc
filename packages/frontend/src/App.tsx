import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'layout/Layout';
import { AuthContextProvider } from 'contexts/AuthContext';
import { DataContextProvider } from 'contexts/DataContext';
import { authProvider } from './authProvider';
import { DataProvider } from './dataProvider';
import { theme } from 'theme';

const dataProvider = new DataProvider({ authProvider });

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
            <Layout />
          </Router>
        </DataContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;

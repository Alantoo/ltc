import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'layout/Layout';
import { AuthContextProvider } from 'contexts/AuthContext';
import { authProvider } from './authProvider';
import { theme } from 'theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider auth={authProvider}>
        <Router basename={process.env.PUBLIC_URL}>
          <Layout />
        </Router>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;

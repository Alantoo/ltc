import React from 'react';
import {
  Admin,
  Resource,
  LoginComponent,
  DashboardComponent,
} from 'react-admin';
import { createBrowserHistory } from 'history';
import { MyLayout } from 'components/CustomLayout';
import { LoginPage } from 'components/LoginPage';
import { DashboardPage } from 'components/DashboardPage';
import { AuthContextProvider } from 'contexts/AuthContext';
import users from 'views/users';
import { MyDataProvider } from 'dataProvider';
import { authProvider } from 'authProvider';
import { theme } from 'theme';
import './App.css';

const dataProvider = new MyDataProvider();
const history = createBrowserHistory({
  basename: process.env.REACT_APP_BASENAME,
});

function App() {
  return (
    <AuthContextProvider auth={authProvider}>
      <Admin
        theme={theme}
        history={history}
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={LoginPage as LoginComponent}
        dashboard={DashboardPage as DashboardComponent}
        layout={MyLayout}
      >
        {(permissions) => {
          console.log(permissions);
          return [<Resource name="users" {...users} />];
        }}
      </Admin>
    </AuthContextProvider>
  );
}

export default App;

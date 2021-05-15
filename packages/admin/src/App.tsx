import React from 'react';
import {
  Admin,
  Resource,
  LoginComponent,
  DashboardComponent,
} from 'react-admin';
import createHistory from 'history/createBrowserHistory';
import { MyLayout } from 'components/CustomLayout';
import { LoginPage } from 'components/LoginPage';
import { DashboardPage } from 'components/DashboardPage';
import users from 'views/users';
import { MyDataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import './App.css';

const dataProvider = new MyDataProvider();
const history = createHistory({ basename: process.env.REACT_APP_BASENAME });

function App() {
  return (
    <Admin
      history={history}
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage as LoginComponent}
      dashboard={DashboardPage as DashboardComponent}
      layout={MyLayout}
    >
      <Resource name="users" {...users} />
    </Admin>
  );
}

export default App;

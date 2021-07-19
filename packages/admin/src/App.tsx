import React from 'react';
import {
  Admin,
  Resource,
  LoginComponent,
  DashboardComponent,
} from 'react-admin';
import PeopleIcon from '@material-ui/icons/People';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import ListAltIcon from '@material-ui/icons/ListAlt';
import TuneIcon from '@material-ui/icons/Tune';
import { ThemeProvider } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import { MyLayout } from 'components/CustomLayout';
import { LoginPage } from 'components/LoginPage';
import { DashboardPage } from 'components/DashboardPage';
import { AuthContextProvider } from 'contexts/AuthContext';
import users, { UserListMembers } from 'views/users';
import lists from 'views/lists';
import rotator from 'views/rotator';
import { MyDataProvider } from 'dataProvider';
import { authProvider } from 'authProvider';
import { theme } from 'theme';
import './App.css';

const dataProvider = new MyDataProvider({ authProvider });
const history = createBrowserHistory({
  basename: process.env.REACT_APP_BASENAME,
});

function App() {
  return (
    <ThemeProvider theme={theme}>
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
          {() => {
            return [
              <Resource name="rotator" icon={ListAltIcon} {...rotator} />,
              <Resource name="lists" icon={TuneIcon} {...lists} />,
              <Resource
                name="members"
                icon={PeopleOutlineIcon}
                options={{ label: 'Members list' }}
                {...users}
                list={UserListMembers}
              />,
              <Resource name="users" icon={PeopleIcon} {...users} />,
            ];
          }}
        </Admin>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;

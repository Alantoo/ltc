import { AuthProvider, UserIdentity, fetchUtils } from 'react-admin';

const API_URL = process.env.REACT_APP_API_URL;

const roles = {
  ADMIN: 'admins',
  AGENT: 'agents',
};

export const authProvider: AuthProvider = {
  login: async ({ provider }) => {
    console.log('login');
    return Promise.resolve(true);
  },
  checkError: async (error) => {
    console.log('checkError');
    const { status } = error;
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: async (params) => {
    console.log('checkAuth');
    return Promise.resolve();
  },
  logout: () => {
    return Promise.resolve();
  },
  getIdentity: async () => {
    console.log('getIdentity');
    const user: UserIdentity = {
      id: 'aaaa',
    };
    return Promise.resolve(user);
  },
  getPermissions: async (params) => {
    console.log('getPermissions');
    return Promise.resolve('admin');
  },
};

export default authProvider;

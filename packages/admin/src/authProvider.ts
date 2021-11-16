import { UserIdentity } from 'react-admin';

const API_URL = process.env.REACT_APP_API_URL;

export type JwtPayload = {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isVerified: boolean;
};

export type LoginInfo = JwtPayload & {
  token: string;
  expiresIn: string;
};

export type RefreshInfo = {
  tokenId: string;
  tokenExpires: number;
};

export type LoginResult = {
  loginInfo: LoginInfo;
  refreshInfo: RefreshInfo;
};

type Profile = UserIdentity;

const roles = {
  ADMIN: 'admins',
  AGENT: 'agents',
};

const logoutEventName = 'ra-logout';

export class AuthProvider {
  private token = '';
  private payload: JwtPayload | undefined = undefined;

  private isRefreshing: Promise<any> | null = null;
  private refreshTokenInfo: RefreshInfo | undefined = undefined;
  private refreshTimeOutId = 0;

  constructor() {
    if (window.localStorage['refreshTokenId']) {
      this.refreshTokenInfo = {
        tokenId: window.localStorage['refreshTokenId'],
        tokenExpires: 0,
      };
    }

    window.addEventListener('storage', (event) => {
      if (event.key === logoutEventName) {
        this.token = '';
        this.payload = undefined;
      }
    });
  }

  async checkAuth(params: any): Promise<any> {
    return this.waitForTokenRefresh().then(() => {
      return this.token ? Promise.resolve() : Promise.reject();
    });
  }

  async checkError(error: Response): Promise<any> {
    const { status } = error;
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    const loginUrl = `${API_URL}/auth/login`;
    const request = new Request(loginUrl, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: process.env.REACT_APP_HTTP_CRED as RequestCredentials,
    });
    const response = await fetch(request);
    const data = await response.json();
    if (response.status < 200 || response.status >= 300) {
      throw new Error(data.message || response.statusText);
    }
    return this.setToken(data.loginInfo, data.refreshInfo);
  }

  async register({
    email,
    name,
    firstName,
    lastName,
    password,
  }: {
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<any> {
    const loginUrl = `${API_URL}/auth/register`;
    const request = new Request(loginUrl, {
      method: 'POST',
      body: JSON.stringify({ email, name, firstName, lastName, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: process.env.REACT_APP_HTTP_CRED as RequestCredentials,
    });
    const response = await fetch(request);
    const data = await response.json();
    if (response.status < 200 || response.status >= 300) {
      throw new Error(data.message || response.statusText);
    }
    return this.setToken(data.loginInfo, data.refreshInfo);
  }

  async logout(params: any): Promise<string | false | void> {
    let logoutUrl = `${API_URL}/auth/logout`;
    if (
      process.env.REACT_APP_HTTP_CRED !== 'include' &&
      this.refreshTokenInfo
    ) {
      logoutUrl += `?token=${this.refreshTokenInfo.tokenId}`;
    }
    const request = new Request(logoutUrl, {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: process.env.REACT_APP_HTTP_CRED as RequestCredentials,
    });
    this.clearToken();

    return fetch(request).then(() => '/login');
  }

  async getPermissions(params: any): Promise<any> {
    return this.waitForTokenRefresh().then(() => {
      return this.payload ? Promise.resolve(this.payload) : Promise.reject();
    });
  }

  getToken(): string {
    return this.token;
  }

  private waitForTokenRefresh(): Promise<any> {
    if (this.isRefreshing) {
      return this.isRefreshing.then(() => {
        this.isRefreshing = null;
        return true;
      });
    } else if (!this.token) {
      return this.getRefreshedToken();
    }
    return Promise.resolve();
  }

  getRefreshedToken(): Promise<boolean> {
    let url = `${API_URL}/auth/refresh`;
    if (
      process.env.REACT_APP_HTTP_CRED !== 'include' &&
      this.refreshTokenInfo
    ) {
      url += `?token=${this.refreshTokenInfo.tokenId}`;
    }
    const request = new Request(url, {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: process.env.REACT_APP_HTTP_CRED as RequestCredentials,
    });

    this.isRefreshing = fetch(request)
      .then((response) => {
        if (response.status !== 200) {
          this.clearToken();
          console.log('Token renewal failure');
          return { token: null };
        }
        return response.json();
      })
      .then((loginInfo: LoginInfo) => {
        if (loginInfo && loginInfo.token) {
          this.setToken(loginInfo);
          return true;
        }
        this.clearToken();
        return false;
      });

    return this.isRefreshing;
  }

  private setToken(loginInfo: LoginInfo, refreshInfo?: RefreshInfo) {
    const { token, expiresIn = '600000' } = loginInfo;
    const delay = parseInt(expiresIn, 10);
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.isAdmin) {
      throw new Error('Not admin');
    }
    this.token = token;
    this.payload = payload;
    this.refreshToken(delay);
    if (refreshInfo) {
      this.refreshTokenInfo = refreshInfo;
      if (process.env.REACT_APP_HTTP_CRED !== 'include') {
        window.localStorage['refreshTokenId'] = refreshInfo.tokenId;
      }
    }
    return true;
  }

  private clearToken(): boolean {
    this.token = '';
    this.payload = undefined;
    if (this.refreshTimeOutId) {
      window.clearTimeout(this.refreshTimeOutId);
    }
    window.localStorage.setItem(logoutEventName, `${Date.now()}`);
    window.localStorage['refreshTokenId'] = '';
    return true;
  }

  private refreshToken(delay: number): void {
    this.refreshTimeOutId = window.setTimeout(() => {
      this.getRefreshedToken();
    }, delay - 5000); // Validity period of the token in seconds, minus 5 seconds
  }
}

export const authProvider = new AuthProvider();

export default authProvider;

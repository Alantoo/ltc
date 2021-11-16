import { fetchJson } from './helpers';
const API_URL = process.env.REACT_APP_API_URL;

export type JwtPayload = {
  id: string;
  email: string;
  name: string;
  balance: number;
  roles: string[];
  isVerified: boolean;
};

export type LoginInfo = {
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

export type Profile = JwtPayload;

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

  private onCallbacks: Array<(profile: Profile | undefined) => void> = [];

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

  on(callback: (profile: Profile | undefined) => void): () => void {
    if (!this.onCallbacks.includes(callback)) {
      const index = this.onCallbacks.push(callback);

      return () => {
        this.onCallbacks.splice(index, 1);
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  off(callback: (profile: Profile | undefined) => void): void {
    const index = this.onCallbacks.indexOf(callback);
    if (index !== -1) {
      this.onCallbacks.splice(index, 1);
    }
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
    const data = await fetchJson<LoginResult>(loginUrl, {
      method: 'POST',
      data: { email, password },
    });
    this.setToken(data.loginInfo, data.refreshInfo);
    const username = this.payload ? this.payload.name : '';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.location = `/${username}/profile`;
  }

  async register({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }): Promise<any> {
    const registerUrl = `${API_URL}/auth/register`;
    const data = await fetchJson<LoginResult>(registerUrl, {
      method: 'POST',
      data: { email, name, password },
    });
    this.setToken(data.loginInfo, data.refreshInfo);
    const username = this.payload ? this.payload.name : '';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.location = `/${username}/profile`;
  }

  async logout(params: any): Promise<string | false | void> {
    let logoutUrl = `${API_URL}/auth/logout`;
    if (
      process.env.REACT_APP_HTTP_CRED !== 'include' &&
      this.refreshTokenInfo
    ) {
      logoutUrl += `?token=${this.refreshTokenInfo.tokenId}`;
    }
    this.clearToken();
    await fetchJson<void>(logoutUrl);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.location = '/';
    return '/';
  }

  async getPermissions(params: any): Promise<any> {
    return this.waitForTokenRefresh().then(() => {
      return this.payload ? Promise.resolve(this.payload) : Promise.reject();
    });
  }

  async updateInfo(data: { email: string; password: string }): Promise<void> {
    const updateUrl = `${API_URL}/users/me`;
    await fetchJson<void>(updateUrl, {
      method: 'PUT',
      data,
      token: this.token,
    });
    await this.waitForTokenRefresh(true);
  }

  async sendVerificationCode(): Promise<any> {
    const sendVerifyUrl = `${API_URL}/auth/sendVerify`;
    await fetchJson<void>(sendVerifyUrl, { token: this.token });
  }

  getToken(): string {
    return this.token;
  }

  getUser(): Profile | undefined {
    return this.payload;
  }

  getRefreshedToken(): Promise<boolean> {
    let refreshUrl = `${API_URL}/auth/refresh`;
    if (
      process.env.REACT_APP_HTTP_CRED !== 'include' &&
      this.refreshTokenInfo
    ) {
      refreshUrl += `?token=${this.refreshTokenInfo.tokenId}`;
    }

    this.isRefreshing = fetchJson<LoginInfo>(refreshUrl)
      .catch(() => {
        this.isRefreshing = null;
        this.clearToken();
        console.log('Token renewal failure');
        return { token: '', expiresIn: '0' } as LoginInfo;
      })
      .then((loginInfo) => {
        this.isRefreshing = null;
        if (loginInfo && loginInfo.token) {
          this.setToken(loginInfo);
          return true;
        }
        this.clearToken();
        return false;
      });

    return this.isRefreshing;
  }

  private waitForTokenRefresh(force?: boolean): Promise<any> {
    if (this.isRefreshing) {
      return this.isRefreshing.then(() => {
        this.isRefreshing = null;
        return true;
      });
    } else if (!this.token || force) {
      return this.getRefreshedToken();
    }
    return Promise.resolve();
  }

  private setToken(loginInfo: LoginInfo, refreshInfo?: RefreshInfo) {
    const { token, expiresIn = '600000' } = loginInfo;
    const delay = parseInt(expiresIn, 10);
    this.token = token;
    this.payload = JSON.parse(atob(token.split('.')[1]));
    this.refreshToken(delay);
    if (refreshInfo) {
      this.refreshTokenInfo = refreshInfo;
      if (process.env.REACT_APP_HTTP_CRED !== 'include') {
        window.localStorage['refreshTokenId'] = refreshInfo.tokenId;
      }
    }
    this.triggerUpdate();
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
    this.triggerUpdate();
    return true;
  }

  private triggerUpdate(): void {
    this.onCallbacks.forEach((cb) => {
      try {
        cb(this.payload);
      } catch (e) {
        console.error(`Event handler error: ${e.message}`);
      }
    });
  }

  private refreshToken(delay: number): void {
    if (!delay) {
      return;
    }
    this.refreshTimeOutId = window.setTimeout(() => {
      this.getRefreshedToken();
    }, delay - 5000); // Validity period of the token in seconds, minus 5 seconds
  }
}

export const authProvider = new AuthProvider();

export default authProvider;

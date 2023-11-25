// import { stringify } from 'query-string';
// import {
//   DataProvider,
//   GetListParams,
//   GetListResult,
//   GetOneParams,
//   GetOneResult,
//   GetManyParams,
//   GetManyResult,
//   GetManyReferenceParams,
//   GetManyReferenceResult,
//   CreateParams,
//   CreateResult,
//   UpdateParams,
//   UpdateResult,
//   UpdateManyParams,
//   UpdateManyResult,
//   DeleteParams,
//   DeleteResult,
//   DeleteManyParams,
//   DeleteManyResult,
//   fetchUtils,
// } from 'react-admin';
import { fetchJson, FetchOptions } from 'helpers';
import { AuthProvider } from 'authProvider';

export type ListResult<T> = {
  data: Array<T>;
  total: number;
};

export type SingleResult<T> = T;

type ReqResp = {
  error?: Record<string, string>;
};

type MyRecord = {
  id: string | number;
};

export type Referral = MyRecord & {
  name: string;
  email: string;
};

export type Reward = {
  id: string;
  payType: string;
  payAddress: string;
  payAmount: number;
  list: {
    name: string;
  };
  toUser: {
    name: string;
  };
  fromUser: {
    name: string;
  };
};

export type List = MyRecord & {
  name: string;
  price: number;
  entryPrice: number;
  rotateTime: string;
  selectCount: number;
  src: string;
};

export type User = MyRecord & {
  email: string;
  name: string;
  itemId: string;
};

export type RotatorItem = MyRecord & {
  list: List;
  user: User;
  createdAt: string;
  status: string;
  isSelected: boolean;
  isPaid: boolean;
  payType?: string;
  payAddress?: string;
  payAmount?: string;
  payQrCode?: string;
};

export type PayOut = MyRecord & {
  status: string;
  createdAt: string;
};

export type UserStatus = {
  item?: RotatorItem;
  list: Array<List>;
};

export type ItemStatus = {
  item: RotatorItem;
  list: Array<RotatorItem>;
};

export const rotateStatus = {
  NONE: 'none',
  PAY: 'pay',
  PENDING: 'pending',
  SELECT: 'select',
  ADDED: 'added',
  REMOVED: 'removed',
};

const API_URL = process.env.REACT_APP_API_URL;

export class DataProvider {
  private authProvider?: AuthProvider;

  constructor(options?: { authProvider: AuthProvider }) {
    const { authProvider } = options || {};
    this.authProvider = authProvider;
  }

  private getResourceName(part: string): string {
    if (part === 'transactions') {
      return 'requests';
    }
    return part;
  }

  /**
   *
   * @private
   */
  private async makeRequest<T>(
    url: string,
    options?: FetchOptions,
  ): Promise<T> {
    const fetchOptions = options || {};
    let jwtToken = this.authProvider ? this.authProvider.getToken() : '';
    if (!jwtToken && this.authProvider) {
      if (await this.authProvider.getRefreshedToken()) {
        jwtToken = this.authProvider.getToken();
      }
    }
    fetchOptions.token = jwtToken;
    const res = await fetchJson<T>(url, fetchOptions);
    return res;
  }

  async getUserHistory(): Promise<Array<RotatorItem>> {
    const url = `${API_URL}/rotator/history`;
    const data = await this.makeRequest<Array<RotatorItem>>(url);
    return data;
  }

  async getUserStatus(): Promise<UserStatus> {
    const url = `${API_URL}/rotator/status`;
    const data = await this.makeRequest<UserStatus>(url);
    return data;
  }

  async listStart(
    listId: string | number,
    direct?: boolean,
  ): Promise<{ url: string }> {
    const url = `${API_URL}/rotator/start`;
    const data = await this.makeRequest<{ url: string }>(url, {
      method: 'POST',
      data: { listId, direct },
    });
    return data;
  }

  async getItemStatus(itemId: string | number): Promise<ItemStatus> {
    const url = `${API_URL}/rotator/${itemId}/status`;
    const data = await this.makeRequest<ItemStatus>(url);
    return data;
  }

  async addItemUser(
    itemId: string | number,
    selectedItemId: string | number,
    index: number,
  ): Promise<ItemStatus> {
    const url = `${API_URL}/rotator/${itemId}/select`;
    const data = await this.makeRequest<ItemStatus>(url, {
      method: 'POST',
      data: { selectedItemId, index },
    });
    return data;
  }

  async addItemApproveUser(
    itemId: string | number,
    selectedItemId: string | number,
    trId: string,
  ): Promise<ItemStatus> {
    const url = `${API_URL}/rotator/${itemId}/confirm-select`;
    const data = await this.makeRequest<ItemStatus>(url, {
      method: 'POST',
      data: { selectedItemId, trId },
    });
    return data;
  }

  async getUserBalance(): Promise<{ balance: number }> {
    const url = `${API_URL}/users/me/balance`;
    const data = await this.makeRequest<{ balance: number }>(url, {
      method: 'GET',
    });
    return data;
  }

  async getUserReferrals(): Promise<ListResult<Referral>> {
    const url = `${API_URL}/users/me/referrals`;
    const data = await this.makeRequest<ListResult<Referral>>(url, {
      method: 'GET',
    });
    return data;
  }

  async getUserRewards(): Promise<ListResult<Reward>> {
    const url = `${API_URL}/users/me/rewards`;
    const data = await this.makeRequest<ListResult<Reward>>(url, {
      method: 'GET',
    });
    return data;
  }
}

export const defaultDataProvider = new DataProvider();

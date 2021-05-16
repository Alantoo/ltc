import { stringify } from 'query-string';
import {
  DataProvider,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  GetManyParams,
  GetManyResult,
  GetManyReferenceParams,
  GetManyReferenceResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  UpdateManyParams,
  UpdateManyResult,
  DeleteParams,
  DeleteResult,
  DeleteManyParams,
  DeleteManyResult,
  fetchUtils,
} from 'react-admin';
import { AuthProvider } from 'authProvider';

const { fetchJson } = fetchUtils;

type MyRecord = {
  id: string | number;
};

const API_URL = process.env.REACT_APP_API_URL;

export class MyDataProvider implements DataProvider {
  authProvider: AuthProvider;

  constructor({ authProvider }: { authProvider: AuthProvider }) {
    this.authProvider = authProvider;
  }

  getResourceName(part: string): string {
    if (part === 'transactions') {
      return 'requests';
    }
    return part;
  }

  /**
   *
   * @private
   */
  async makeRequest(request: {
    url: string;
    options?: Record<string, string>;
  }): Promise<any> {
    const headers = new Headers();
    let jwtToken = this.authProvider.getToken();
    if (!jwtToken) {
      if (await this.authProvider.getRefreshedToken()) {
        jwtToken = this.authProvider.getToken();
      }
    }
    if (jwtToken) {
      headers.set('Authorization', `Bearer ${jwtToken}`);
    }
    const res = await fetchJson(request.url, { ...request.options, headers });
    return res.json;
  }

  async getList<T>(
    resource: string,
    params: GetListParams,
  ): Promise<GetListResult<T>> {
    const resourceName = this.getResourceName(resource);
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const rangeStart = (page - 1) * perPage;
    const rangeEnd = page * perPage - 1;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([rangeStart, rangeEnd]),
      filter: JSON.stringify(params.filter),
    };
    const request = { url: `${API_URL}/${resourceName}?${stringify(query)}` };
    const data = await this.makeRequest(request);

    return {
      data: data.data,
      total: data.total,
    };
  }

  async getOne<T>(
    resource: string,
    params: GetOneParams,
  ): Promise<GetOneResult<T>> {
    const resourceName = this.getResourceName(resource);
    const request = { url: `${API_URL}/${resourceName}/${params.id}` };
    const data = await this.makeRequest(request);
    return { data };
  }

  async getMany<MyRecord>(
    resource: string,
    params: GetManyParams,
  ): Promise<GetManyResult<MyRecord>> {
    const resourceName = this.getResourceName(resource);
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const request = { url: `${API_URL}/${resourceName}?${stringify(query)}` };
    const data = await this.makeRequest(request);
    return { data };
  }

  async getManyReference<MyRecord>(
    resource: string,
    params: GetManyReferenceParams,
  ): Promise<GetManyReferenceResult<MyRecord>> {
    const resourceName = this.getResourceName(resource);
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
    };
    const request = { url: `${API_URL}/${resourceName}?${stringify(query)}` };
    const data = await this.makeRequest(request);

    return {
      data: data.data,
      total: data.total,
    };
  }

  async create<T>(
    resource: string,
    params: CreateParams,
  ): Promise<CreateResult<T>> {
    const resourceName = this.getResourceName(resource);
    const request = {
      url: `${API_URL}/${resourceName}`,
      options: { method: 'POST', body: JSON.stringify(params.data) },
    };
    const data = await this.makeRequest(request);
    return { data };
  }

  async update<T>(
    resource: string,
    params: UpdateParams,
  ): Promise<UpdateResult<T>> {
    const resourceName = this.getResourceName(resource);
    const request = {
      url: `${API_URL}/${resourceName}/${params.id}`,
      options: { method: 'PUT', body: JSON.stringify(params.data) },
    };
    const data = await this.makeRequest(request);
    return { data };
  }

  async updateMany<T>(
    resource: string,
    params: UpdateManyParams,
  ): Promise<UpdateManyResult> {
    const resourceName = this.getResourceName(resource);
    const request = {
      url: `${API_URL}/${resourceName}`,
      options: { method: 'PUT', body: JSON.stringify(params) },
    };
    const data = await this.makeRequest(request);
    return { data };
  }

  async delete<T>(
    resource: string,
    params: DeleteParams,
  ): Promise<DeleteResult<T>> {
    const resourceName = this.getResourceName(resource);
    const request = {
      url: `${API_URL}/${resourceName}/${params.id}`,
      options: { method: 'DELETE' },
    };
    const data = await this.makeRequest(request);
    return { data };
  }

  async deleteMany<T>(
    resource: string,
    params: DeleteManyParams,
  ): Promise<DeleteManyResult> {
    const resourceName = this.getResourceName(resource);
    const request = {
      url: `${API_URL}/${resourceName}`,
      options: { method: 'DELETE', body: JSON.stringify({ ids: params.ids }) },
    };
    const data = await this.makeRequest(request);
    return { data };
  }
}

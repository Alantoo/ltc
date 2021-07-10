import { Inject, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Webhook } from 'coinbase-commerce-node';

const DEFAULT_TIMEOUT = 1000 * 60 * 60; // 1 hour
const API_URL = 'https://api.commerce.coinbase.com';

export type PaymentCreate = {
  name: string;
  description?: string;
  price: string;
};

@Injectable()
export class PaymentService {
  protected logger = new Logger(PaymentService.name);

  private client: AxiosInstance;

  constructor() {
    this.client = axios.create();
    this.client.defaults.timeout = DEFAULT_TIMEOUT;
  }

  private async makeRequest(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) {
    const defHeaders = {
      'X-CC-Api-Key': process.env.COINBASE_API_KEY,
      'X-CC-Version': '2018-03-22',
    };
    const opts = {
      timeout: DEFAULT_TIMEOUT,
      ...config,
      headers: {
        ...defHeaders,
        ...(config ? config.headers || {} : {}),
      },
      data,
    };
    try {
      const res = await this.client(url, opts);
      return res.data;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async chargesList() {
    const url = `${API_URL}/charges?pricing_type=no_price`;
    const res = await this.makeRequest(url, undefined, { method: 'GET' });
    return res;
  }

  async chargesCreate(obj: PaymentCreate) {
    const url = `${API_URL}/charges`;
    const local_price = { currency: 'USD', amount: obj.price };
    const data = {
      name: '',
      description: '',
      pricing_type: 'fixed_price',
      local_price,
      // metadata: {
      //   customer_id: 'id_1005',
      //   customer_name: 'Satoshi Nakamoto',
      // },
      redirect_url: `${process.env.HOST}/profile`,
      cancel_url: `${process.env.HOST}/profile`,
      ...obj,
    };
    const res = await this.makeRequest(url, data, { method: 'POST' });
    return res.data;
  }

  async getEvent(rawBody: string, signature: string) {
    const event = Webhook.verifyEventBody(
      rawBody,
      signature,
      process.env.COINBASE_WEBHOOK_KEY,
    );
    return event;
  }
}

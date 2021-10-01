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

export type TransactionInfo = {
  txId: string;
  currency: string;
  success: boolean;
  from: string;
  to: string;
  value: number;
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

  async chargeGetInfo(code: string): Promise<TransactionInfo> {
    try {
      const url = `${API_URL}/charges/${code}`;
      const res = await this.makeRequest(url);
      const txId = res.data.payments[0].transaction_id;
      const currency = res.data.payments[0].value.crypto.currency;
      const txInfo = await this.getTxInfo(currency, txId);
      return txInfo;
    } catch (err) {
      this.logger.log(`Charge "${code}" info error:`);
      this.logger.error(err);
    }
  }

  public async getTxInfo(
    currency: string,
    txId: string,
  ): Promise<TransactionInfo> {
    if (currency === 'BTC') {
      return this.getBTCTxInfo(txId);
    }
    return this.getETHTxInfo(txId);
  }

  private async getBTCTxInfo(txId: string): Promise<TransactionInfo> {
    try {
      const url = `https://blockchain.info/rawtx/${txId}`;
      const res = await this.client(url);
      const data = res.data;
      const input = data.inputs[0];
      const out = data.out[0];
      const from = input.prev_out.addr;
      const to = out.addr;
      const value = out.value / 100000000;
      const success = !!data.block_index && !!data.block_height;
      return { currency: 'BTC', txId, success, from, to, value };
    } catch (err) {
      this.logger.log(`BTC tx "${txId}" info error:`);
      this.logger.error(err);
    }
  }

  private async getETHTxInfo(txId: string): Promise<TransactionInfo> {
    try {
      const url = `https://api.ethplorer.io/getTxInfo/${txId}?apiKey=freekey`;
      const res = await this.client(url);
      const data = res.data;
      const from = data.from;
      const to = data.to;
      const success = data.success === true;
      const value = data.value;
      return { currency: 'ETH', txId, success, from, to, value };
    } catch (err) {
      this.logger.log(`ETH tx "${txId}" info error:`);
      this.logger.error(err);
    }
  }

  async getEvent(rawBody: string, signature: string) {
    const event = Webhook.verifyEventBody(
      rawBody,
      signature,
      process.env.COINBASE_WEBHOOK_KEY,
    );
    return event;
  }

  async getCoinsAmount(coinType: string, amountUsd: number): Promise<number> {
    const url = `https://api.coinbase.com/v2/exchange-rates?currency=${coinType}`;
    const fix = coinType === 'BTC' ? 10000000 : 1000000;
    const res = await this.client(url);
    const data = res.data.data;
    const rates = data.rates;
    const USD = rates.USD;
    const rate = parseInt(USD, 10);
    const num = amountUsd / rate;
    const numFix = Math.ceil(num * fix) / fix;
    return numFix;
  }

  async getQrCode(
    currency: string,
    address: string,
    amount: number,
  ): Promise<string> {
    const type = currency === 'BTC' ? 'bitcoin' : 'ethereum';
    const baseUrl =
      'https://chart.googleapis.com/chart?chs=225x225&chld=L|2&cht=qr';
    const url = `${baseUrl}&chl=${type}:${address}?amount=${amount}`;
    const res = await this.client(url, {
      method: 'GET',
      responseType: 'arraybuffer',
    });
    const data = Buffer.from(res.data, 'binary').toString('base64');
    const contentType = res.headers['content-type'];
    const image = `data:${contentType};base64,${data}`;
    return image;
  }
}

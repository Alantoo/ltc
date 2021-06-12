import Portis from '@portis/web3';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

const config = {
  appId: '1c679929-6446-4203-a66f-a11421210725',
  network: 'kovan',
  bitcoinPath: "m/49'/0'/0'",
  bitcoinName: 'Bitcoin',
  gas: 100000,
  daiContractAddress: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
};

const daiTokenABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    name: 'transfer',
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: true,
    type: 'function',
  },
];

export class WalletProvider {
  private portis: Portis;

  private web3: Web3;

  private walletAddress?: string;

  private onLoggedChangeCbs: Array<(isLoggedIn: boolean) => void> = [];

  private onBalanceChangeCbs: Array<() => void> = [];

  private waitWalletAddressPromise?: Promise<void>;
  private waitWalletAddressPromiseResolve?: () => void;
  private waitWalletAddressPromiseReject?: () => void;

  constructor() {
    this.portis = new Portis(config.appId, config.network);
    this.web3 = new Web3(this.portis.provider);

    this.portis.onLogin(
      (walletAddress: string, email?: string, reputation?: string) => {
        this.walletAddress = walletAddress;
        this.triggerLoggedChange(true);
        if (
          this.waitWalletAddressPromise &&
          this.waitWalletAddressPromiseResolve
        ) {
          this.waitWalletAddressPromiseResolve();
        }
      },
    );

    this.portis.onLogout(() => {
      this.triggerLoggedChange(false);
    });
  }

  onLoggedChange(callback: (isLoggedIn: boolean) => void) {
    this.onLoggedChangeCbs.push(callback);
  }

  onBalanceChange(callback: () => void) {
    this.onBalanceChangeCbs.push(callback);
  }

  private triggerLoggedChange(isLoggedIn: boolean) {
    this.onLoggedChangeCbs.forEach((callback) => {
      callback(isLoggedIn);
    });
  }

  private triggerBalanceChange() {
    this.onBalanceChangeCbs.forEach((callback) => {
      callback();
    });
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const res = await this.portis.isLoggedIn();
      if (res.error) {
        console.error(res.error);
        return false;
      }
      if (res.result) {
        const accounts = await this.web3.eth.getAccounts();
        this.walletAddress = accounts[0];
      }
      return res.result;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async login() {
    const accounts = await this.web3.eth.getAccounts();
  }

  async logout() {
    try {
      await this.portis.logout();
    } catch (err) {}
    this.triggerLoggedChange(false);
  }

  async getEthBalance(): Promise<string> {
    await this.waitWalletAddress();
    if (!this.walletAddress) {
      return '';
    }
    const balance = await this.web3.eth.getBalance(this.walletAddress);
    return this.web3.utils.fromWei(balance);
  }

  async getDaiBalance(): Promise<string> {
    await this.waitWalletAddress();
    if (!this.walletAddress) {
      return '';
    }
    const tokenInst = new this.web3.eth.Contract(
      daiTokenABI as AbiItem[],
      config.daiContractAddress,
    );

    const balance = await tokenInst.methods
      .balanceOf(this.walletAddress)
      .call();

    return this.web3.utils.fromWei(balance);
  }

  async sendEth(amount: string, to: string): Promise<string> {
    try {
      const from = await this.web3.eth.getCoinbase();
      const value = this.web3.utils.toWei(amount);
      const transaction = await this.web3.eth.sendTransaction({
        value,
        from,
        to,
        chain: config.network,
        gas: config.gas,
      });
      this.triggerBalanceChange();
      return transaction.transactionHash;
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  async sendDai(amount: string, to: string): Promise<string> {
    try {
      await this.waitWalletAddress();
      if (!this.walletAddress) {
        return '';
      }
      const value = this.web3.utils.toWei(amount);
      const from = await this.web3.eth.getCoinbase();
      const tokenInst = new this.web3.eth.Contract(
        daiTokenABI as AbiItem[],
        config.daiContractAddress,
      );

      const transaction = await tokenInst.methods.transfer(to, value).send({
        from,
        chain: config.network,
        gas: config.gas,
      });
      this.triggerBalanceChange();

      return transaction.transactionHash;
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  private async waitWalletAddress(): Promise<void> {
    if (this.walletAddress) {
      return;
    }
    if (this.waitWalletAddressPromise) {
      return await this.waitWalletAddressPromise;
    }
    this.waitWalletAddressPromise = new Promise<void>((resolve, reject) => {
      this.waitWalletAddressPromiseResolve = resolve;
      this.waitWalletAddressPromiseReject = reject;
    });
    return await this.waitWalletAddressPromise;
  }
}

export const walletProvider = new WalletProvider();

export default walletProvider;

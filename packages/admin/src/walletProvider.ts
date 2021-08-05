import Web3 from 'web3';

let web3: Web3 | undefined = undefined; // Will hold the web3 instance

const initMetamask = async (showAlerts?: boolean) => {
  if (!(window as any).ethereum) {
    if (showAlerts) {
      window.alert('Please install MetaMask first.');
    }
    return;
  }

  if (!web3) {
    try {
      await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });
      // await window.ethereum.enable();
      web3 = new Web3((window as any).ethereum);
      return web3;
    } catch (error) {
      if (showAlerts) {
        window.alert('You need to allow MetaMask.');
      }
      return;
    }
  }
  return web3;
};

const sendEth = async (amount: string, to: string): Promise<string> => {
  const web3 = await initMetamask(true);
  if (!web3) {
    return '';
  }
  const from = await web3.eth.getCoinbase();
  if (!from) {
    window.alert('Please activate MetaMask first.');
    return '';
  }

  const value = web3.utils.toWei(amount);
  const transaction = await web3.eth.sendTransaction({
    value,
    from,
    to,
    //chainId: 4,
    //gasPrice: 500000,
    gas: 1000000,
  });
  return transaction.transactionHash;
};

export const walletProvider = {
  sendEth,
};

export default walletProvider;

import React, { createContext, useState, useCallback, useEffect } from 'react';
import walletProvider, { WalletProvider } from 'walletProvider';

export type WalletContextType = {
  walletProvider: WalletProvider;
  loading: boolean;
  isLoggedIn: boolean;
  ethBalance: string;
  daiBalance: string;
  updateEthBalanceCache: () => void;
  updateDaiBalanceCache: () => void;
};

const defaultContext = {
  walletProvider,
  loading: true,
  isLoggedIn: false,
  ethBalance: '',
  daiBalance: '',
  updateEthBalanceCache: () => '',
  updateDaiBalanceCache: () => '',
};

export const WalletContext = createContext<WalletContextType>(defaultContext);

type Props = {
  children: React.ReactElement;
  walletProvider: WalletProvider;
};

export const WalletContextProvider = ({ children, walletProvider }: Props) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ethBalance, setEthBalance] = useState('');
  const [ethBalanceCache, setEthBalanceCache] = useState(0);
  const [daiBalance, setDaiBalance] = useState('');
  const [daiBalanceCache, setDaiBalanceCache] = useState(0);

  const updateEthBalanceCache = useCallback(() => {
    setEthBalanceCache(ethBalanceCache + 1);
  }, [ethBalanceCache, setEthBalanceCache]);

  const updateDaiBalanceCache = useCallback(() => {
    setDaiBalanceCache(daiBalanceCache + 1);
  }, [daiBalanceCache, setDaiBalanceCache]);

  useEffect(() => {
    walletProvider.isLoggedIn().then((res) => {
      setLoading(false);
      setIsLoggedIn(res);
    });

    walletProvider.onLoggedChange((res) => {
      setIsLoggedIn(res);
    });

    walletProvider.onBalanceChange(() => {
      updateEthBalanceCache();
      updateDaiBalanceCache();
    });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setEthBalance('');
      setDaiBalance('');
      return;
    }

    walletProvider
      .getEthBalance()
      .then((res) => {
        setEthBalance(res);
      })
      .catch((err) => {
        console.error(err);
        setEthBalance('');
      });

    walletProvider
      .getDaiBalance()
      .then((res) => {
        setDaiBalance(res);
      })
      .catch((err) => {
        console.error(err);
        setDaiBalance('');
      });
  }, [isLoggedIn, ethBalanceCache, daiBalanceCache]);

  return (
    <WalletContext.Provider
      value={{
        walletProvider,
        loading,
        isLoggedIn,
        ethBalance,
        daiBalance,
        updateEthBalanceCache,
        updateDaiBalanceCache,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const WalletContextConsumer = WalletContext.Consumer;

export default WalletContext;

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { defaultDataProvider, DataProvider } from 'dataProvider';

export type DataContextType = {
  dataProvider: DataProvider;
  payOutPopupOpened: boolean;
  setPayOutPopupOpened: (value: boolean) => void;
  // userBalance: number;
  // refreshUserBalance: () => void;
};

const defaultContext = {
  dataProvider: defaultDataProvider,
  payOutPopupOpened: false,
  setPayOutPopupOpened: () => ({}),
  // userBalance: 0,
  // refreshUserBalance: () => {
  //   return '';
  // },
};

export const DataContext = createContext<DataContextType>(defaultContext);

type Props = {
  children: React.ReactElement;
  dataProvider: DataProvider;
};

export const DataContextProvider = ({ children, dataProvider }: Props) => {
  const [payOutPopupOpened, setPayOutPopupOpened] = useState(false);
  // const [userBalance, setUserBalance] = useState(0);
  // const [userBalanceCache, setUserBalanceCache] = useState(0);

  // const refreshUserBalance = useCallback(() => {
  //   setUserBalanceCache(userBalanceCache + 1);
  // }, [userBalanceCache, setUserBalanceCache]);

  // useEffect(() => {
  //   dataProvider
  //     .getUserBalance()
  //     .then((data) => {
  //       setUserBalance(data.balance);
  //     })
  //     .catch((err) => {
  //       setUserBalance(0);
  //       console.error(err);
  //     });
  // }, [userBalanceCache]);

  return (
    <DataContext.Provider
      value={{
        dataProvider,
        payOutPopupOpened,
        setPayOutPopupOpened,
        // userBalance,
        // refreshUserBalance,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const DataContextConsumer = DataContext.Consumer;

export default DataContext;

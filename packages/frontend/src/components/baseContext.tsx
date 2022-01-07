import React, { createContext, useEffect, useState, useCallback } from 'react';

export type DataProviderContextType = {
  dataset: string;
  setDataset: (value: string) => void;
};

const defaultContext = {
  dataset: '',
  setDataset: () => ({}),
};

export const BaseContext = createContext<DataProviderContextType>(
  defaultContext,
);

type Props = {
  children: React.ReactElement;
};

export const DataProviderContextProvider = ({ children }: Props) => {
  const [dataset, setDataset] = useState('');

  return (
    <BaseContext.Provider value={{ dataset, setDataset }}>
      {children}
    </BaseContext.Provider>
  );
};

export const DataProviderContextConsumer = BaseContext.Consumer;

export default BaseContext;

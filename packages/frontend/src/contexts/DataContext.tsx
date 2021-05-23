import React, { createContext, useEffect, useState } from 'react';
import { defaultDataProvider, DataProvider } from 'dataProvider';

export type DataContextType = {
  dataProvider: DataProvider;
};

const defaultContext = {
  dataProvider: defaultDataProvider,
};

export const DataContext = createContext<DataContextType>(defaultContext);

type Props = {
  children: React.ReactElement;
  dataProvider: DataProvider;
};

export const DataContextProvider = ({ children, dataProvider }: Props) => {
  return (
    <DataContext.Provider value={{ dataProvider }}>
      {children}
    </DataContext.Provider>
  );
};

export const DataContextConsumer = DataContext.Consumer;

export default DataContext;

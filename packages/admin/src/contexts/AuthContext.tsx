import React, { createContext, useState } from 'react';
import { authProvider, AuthProvider } from 'authProvider';

export type AuthContextType = {
  auth: AuthProvider;
  loading: boolean;
};

const defaultContext = {
  auth: authProvider,
  loading: false,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

type Props = {
  children: React.ReactElement;
  auth: AuthProvider;
};

export const AuthContextProvider = ({ children, auth }: Props) => {
  const [loading, setLoading] = useState(true);

  return (
    <AuthContext.Provider value={{ auth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextConsumer = AuthContext.Consumer;

export default AuthContext;

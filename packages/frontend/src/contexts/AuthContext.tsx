import React, { createContext, useEffect, useState } from 'react';
import { authProvider, AuthProvider, Profile } from 'authProvider';

export type AuthContextType = {
  auth: AuthProvider;
  user: Profile | undefined;
  loading: boolean;
  authModalOpened: string | undefined;
  setAuthModalOpened: (modalName?: string) => void;
};

const defaultContext = {
  auth: authProvider,
  user: undefined,
  loading: false,
  authModalOpened: undefined,
  setAuthModalOpened: () => ({}),
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

type Props = {
  children: React.ReactElement;
  auth: AuthProvider;
};

export const AuthContextProvider = ({ children, auth }: Props) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Profile | undefined>();
  const [authModalOpened, setAuthModalOpened] = useState<string | undefined>();

  useEffect(() => {
    setLoading(true);

    auth.on((newUser) => {
      setUser(newUser);
      if (newUser) {
        setAuthModalOpened(undefined);
      }
    });

    auth
      .getRefreshedToken()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, user, loading, authModalOpened, setAuthModalOpened }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextConsumer = AuthContext.Consumer;

export default AuthContext;

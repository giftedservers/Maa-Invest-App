import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../api/types';
import { getToken, clearToken } from '../api/client';
import * as authApi from '../api/auth';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  pinSet: boolean;
  signIn: (identity: string, password: string) => Promise<void>;
  signUp: (input: { full_name: string; email: string; phone: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  markPinSet: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pinSet, setPinSet] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        try {
          const me = await authApi.fetchMe();
          setUser(me);
          const existingPin = await SecureStore.getItemAsync('maa_invest_pin');
          if (existingPin) setPinSet(true);
        } catch {
          await clearToken();
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (identity: string, password: string) => {
    const me = await authApi.login(identity, password);
    setUser(me);
  }, []);

  const signUp = useCallback(
    async (input: { full_name: string; email: string; phone: string; password: string }) => {
      const me = await authApi.register(input);
      setUser(me);
    },
    []
  );

  const signOut = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setPinSet(false);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authApi.fetchMe();
      setUser(me);
    } catch {
      // ignore — keep stale user rather than booting them out on a flaky request
    }
  }, []);

  const markPinSet = useCallback(() => setPinSet(true), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        pinSet,
        signIn,
        signUp,
        signOut,
        refreshUser,
        markPinSet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

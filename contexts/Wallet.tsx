import { useToast } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  WalletTokensQuery,
  useWalletTokensLazyQuery,
} from '../graphql/graphql';
import { connect, disconnect, getCachedProvider } from '../services/Wallet';

export type WalletToken = NonNullable<WalletTokensQuery['wallet']>['tokens'][0];

export interface Context {
  ready: boolean;
  setReady: (ready: boolean) => void;

  isConnected: boolean;
  currentAccount: string | undefined;

  loadingWalletTokens: boolean;
  walletTokens: WalletToken[];

  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const ADDRESS_CRO = '0x0000000000000000000000000000000000000000';
export const ADDRESS_WCRO = '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23';

const WalletContext = createContext({});

const WalletProvider: React.FC = ({ children }) => {
  const walletConnected = useRef<boolean>(false);

  const [ready, setReady] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [loadingWalletTokens, setLoadingWalletTokens] = useState(false);
  const [walletTokens, setWalletTokens] = useState<WalletToken[]>([]);

  const toast = useToast();

  const [getWalletTokens] = useWalletTokensLazyQuery();

  useEffect(() => {
    const hasCachedProvider = !!getCachedProvider();

    if (ready && hasCachedProvider && !walletConnected.current) {
      connect()
        .then((result) => {
          walletConnected.current = true;
          setCurrentAccount(result.address);

          toast({
            title: 'Welcome back, friend',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((error) => {
          if ((error as Error).message !== 'User closed modal') {
            toast({
              title: 'Uh oh, friend',
              description: (error as Error).message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        });
    }

    setReady(true);
  }, [toast, ready]);

  useEffect(() => {
    if (walletConnected.current && currentAccount) {
      setLoadingWalletTokens(true);

      getWalletTokens({
        variables: {
          address: currentAccount,
        },
      }).then((result) => {
        if (result.data) {
          setLoadingWalletTokens(false);
          setWalletTokens((result.data.wallet || { tokens: [] }).tokens);
        }
      });
    }
  }, [currentAccount]);

  const connectWallet = useCallback(async () => {
    if (!walletConnected.current) {
      try {
        const result = await connect();

        walletConnected.current = true;
        setCurrentAccount(result.address);

        toast({
          title: 'Welcome back, friend',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        if ((error as Error).message !== 'User closed modal') {
          throw error;
        }
      }
    } else {
      return Promise.resolve();
    }
  }, [toast]);

  const disconnectWallet = useCallback(async () => {
    await disconnect();

    setCurrentAccount(undefined);
    walletConnected.current = false;
  }, []);

  const value: Context = {
    ready,
    setReady,

    isConnected: walletConnected.current,
    currentAccount,

    loadingWalletTokens,
    walletTokens,

    connect: connectWallet,
    disconnect: disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

const useWalletContext = (): Context => {
  const context = useContext(WalletContext) as Context;

  return context;
};

export { WalletContext, WalletProvider, useWalletContext };

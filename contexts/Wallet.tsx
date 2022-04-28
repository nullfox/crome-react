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

import { connect, disconnect, getCachedProvider } from '../services/Wallet';

export interface UserToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  quantity: BigNumber;
  usdcPer: BigNumber;
  usdcTotal: BigNumber;
}

export enum TokenState {
  NOT_LOADED,
  LOADING,
  LOADED,
  LOAD_FAILED,
}

export interface Context {
  ready: boolean;
  setReady: (ready: boolean) => void;

  isConnected: boolean;
  currentAccount: string | undefined;

  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

/* class WalletError extends Error {
  code?: number;
} */

const WalletContext = createContext({});

const WalletProvider: React.FC = ({ children }) => {
  const walletConnected = useRef<boolean>(false);

  const [ready, setReady] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();

  const toast = useToast();

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

  /* useEffect(() => {
    if (walletConnected.current && currentAccount) {
      loadTokens();
    }
  }, [currentAccount]); */

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
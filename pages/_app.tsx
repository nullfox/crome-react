import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@fontsource/noto-sans/200.css';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/600.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/900.css';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef, useState } from 'react';

import { WalletProvider } from '../contexts/Wallet';
import Primary from '../layouts/Primary';
import '../styles/globals.css';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  Heading: {
    baseStyle: {
      fontWeight: '500',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#191a29',
      },
    },
  },
  fonts: {
    body: 'Poppins',
    heading: 'Poppins',
  },
});

const CRODex: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  const [checkedRoute, setCheckedRoute] = useState(false);
  const apolloClient = useRef<
    ApolloClient<NormalizedCacheObject> | undefined
  >();

  useEffect(() => {
    if (!checkedRoute) {
      if (
        router.asPath !== '/' &&
        router.asPath.length > 0 &&
        !router.asPath.includes('[')
      ) {
        setCheckedRoute(true);
        router.replace(router.asPath);
      }
    }
  }, [router.asPath, checkedRoute]);

  useEffect(() => {
    if (!apolloClient.current) {
      const cache = new InMemoryCache();

      persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
      }).then(() => {
        apolloClient.current = new ApolloClient({
          uri: 'https://api.dev.crome.app/v1/graphql', // 'https://dzv42xwcsi.execute-api.us-east-1.amazonaws.com/dev/graphql',
          cache,
        });
      });
    }
  });

  if (!apolloClient.current) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient.current}>
      <ChakraProvider theme={theme}>
        <WalletProvider>
          <Primary>
            <Component {...pageProps} />
          </Primary>
        </WalletProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default CRODex;

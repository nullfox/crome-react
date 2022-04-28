import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@fontsource/noto-sans/200.css';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/600.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/900.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { FC } from 'react';

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

  if (router.asPath !== '/' && router.asPath.length > 0) {
    router.replace(router.asPath);
  }

  return (
    <ApolloProvider
      client={
        new ApolloClient({
          uri: 'https://dzv42xwcsi.execute-api.us-east-1.amazonaws.com/dev/graphql', // 'http://localhost:3001/dev/graphql',
          cache: new InMemoryCache(),
        })
      }
    >
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

import { Box, Flex, Heading, List, ListItem, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useWalletContext } from '../contexts/Wallet';
import { useWalletTokensLazyQuery } from '../graphql/graphql';

const Home: NextPage = () => {
  const router = useRouter();

  const { currentAccount } = useWalletContext();

  const [getTokens, { data, loading }] = useWalletTokensLazyQuery();

  useEffect(() => {
    if (currentAccount) {
      getTokens({
        variables: {
          address: currentAccount,
        },
      });
    }
  }, [currentAccount]);

  if (!data || loading) {
    return null;
  }

  return (
    <Flex flexDir="column" w="50%" mx="auto" mt={10}>
      <Heading textAlign="center">My Tokens</Heading>

      <List pt={6}>
        {data.wallet.tokens.map((token) => (
          <ListItem
            key={token.address}
            _hover={{ cursor: 'pointer' }}
            onClick={() => router.push(`/token/${token.address}`)}
          >
            <Box>{token.symbol}</Box>
            <Box>
              <Text fontWeight="600">
                $
                {(+ethers.utils.formatUnits(
                  token.usdcTotal,
                  token.decimals,
                )).toFixed(2)}
              </Text>
              <Text>
                {(+ethers.utils.formatUnits(
                  token.balance,
                  token.decimals,
                )).toFixed(4)}
              </Text>
            </Box>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
};

export default Home;

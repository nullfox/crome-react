import { Box, Flex, Heading, List, ListItem, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useWalletContext } from '../contexts/Wallet';

const Home: NextPage = () => {
  const router = useRouter();

  const { loadingWalletTokens, walletTokens } = useWalletContext();

  if (!walletTokens || loadingWalletTokens) {
    return null;
  }

  return (
    <Flex flexDir="column" w="50%" mx="auto" mt={10}>
      <Heading textAlign="center">My Tokens</Heading>

      <List pt={6}>
        {walletTokens.map((token) => (
          <ListItem
            key={token.address}
            _hover={{ cursor: 'pointer' }}
            onClick={() => router.push(`/token/${token.address}`)}
          >
            <Box>{token.symbol}</Box>
            <Box>
              <Text fontWeight="600">
                ${(+ethers.utils.formatUnits(token.usdcTotal, 6)).toFixed(2)}
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

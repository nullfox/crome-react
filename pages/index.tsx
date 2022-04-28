import { Box, Flex, Heading, List, ListItem } from '@chakra-ui/react';
import { ethers } from 'ethers';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { TokenState, useWalletContext } from '../contexts/Wallet';

const Home: NextPage = () => {
  const router = useRouter();
  const { tokens, tokenState } = useWalletContext();

  console.log(tokenState, tokens);

  return (
    <Flex flexDir="column" w="50%" mx="auto" mt={10}>
      <Heading textAlign="center">My Tokens</Heading>

      {tokenState === TokenState.LOADED && (
        <List pt={6}>
          {tokens.map((token) => (
            <ListItem
              key={token.address}
              _hover={{ cursor: 'pointer' }}
              onClick={() => router.push(`/token/${token.address}`)}
            >
              <Box>{token.symbol}</Box>
              <Box>{ethers.utils.formatEther(token.quantity)}</Box>
            </ListItem>
          ))}
        </List>
      )}
    </Flex>
  );
};

export default Home;

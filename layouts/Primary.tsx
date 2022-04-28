import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';

import Navbar from '../components/Navbar';
import { useWalletContext } from '../contexts/Wallet';

const Primary: FC = ({ children }) => {
  const { currentAccount, isConnected, connect, disconnect } =
    useWalletContext();

  return (
    <Box w="full">
      <Box w="full" px="2%">
        <Navbar
          account={currentAccount}
          isConnected={isConnected}
          onConnect={connect}
          onDisconnect={disconnect}
        />
      </Box>
      {children}
    </Box>
  );
};

export default Primary;

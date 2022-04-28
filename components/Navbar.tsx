import {
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { AiOutlineDisconnect } from 'react-icons/ai';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';

export interface NavbarProps {
  account?: string | undefined;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const Navbar: FC<NavbarProps> = ({
  account,
  isConnected,
  onConnect,
  onDisconnect,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const mobileNav = useDisclosure();

  return (
    <>
      <chakra.header w="full" px={{ base: 1, sm: 2 }} py={4} pb={1}>
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <Flex>
            <chakra.a
              as={Link}
              href="/"
              title="CROme Home Page"
              display="flex"
              alignItems="center"
            >
              <Box _hover={{ cursor: 'pointer' }}>
                <Heading
                  fontSize="2xl"
                  fontFamily="Noto Sans"
                  fontWeight="400"
                  border="1px solid #f1f1f1"
                  borderRadius={4}
                  p={3}
                  py={1}
                >
                  CRO
                  <Text display="inline" fontWeight="200">
                    me
                  </Text>
                </Heading>
              </Box>
            </chakra.a>
          </Flex>
          <HStack display="flex" alignItems="center" spacing={1}>
            {isConnected && account && (
              <Popover>
                <PopoverTrigger>
                  <Button size="md">{`${account.slice(0, 8)}...`}</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Button
                      leftIcon={<AiOutlineDisconnect />}
                      w="full"
                      onClick={onDisconnect}
                    >
                      DISCONNECT
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
            {(!isConnected || !account) && (
              <Button
                size="lg"
                onClick={onConnect}
                leftIcon={<MdOutlineAccountBalanceWallet />}
                fontWeight="600"
              >
                CONNECT WALLET
              </Button>
            )}
            <Box display={{ base: 'inline-flex', md: 'none' }}>
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                aria-label="Open menu"
                fontSize="20px"
                color={useColorModeValue('gray.800', 'inherit')}
                variant="ghost"
                icon={<AiOutlineMenu />}
                onClick={mobileNav.onOpen}
              />

              <VStack
                pos="absolute"
                top={0}
                left={0}
                right={0}
                display={mobileNav.isOpen ? 'flex' : 'none'}
                flexDirection="column"
                p={2}
                pb={4}
                m={2}
                bg={bg}
                spacing={3}
                rounded="sm"
                shadow="sm"
                zIndex={9999}
              >
                <CloseButton
                  aria-label="Close menu"
                  onClick={mobileNav.onClose}
                />
              </VStack>
            </Box>
          </HStack>
        </Flex>
      </chakra.header>
    </>
  );
};

export default Navbar;

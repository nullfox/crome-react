import {
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  List,
  ListItem,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { orderBy } from 'lodash';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import {
  BiInfoCircle,
  BiLinkExternal,
  BiSearch,
  BiWallet,
} from 'react-icons/bi';

import Search from '../../components/TokenDetails/Search';
import {
  ADDRESS_CRO,
  ADDRESS_WCRO,
  useWalletContext,
} from '../../contexts/Wallet';
import { useTokenLazyQuery } from '../../graphql/graphql';

// import Chart from 'react-apexcharts';

// import styles from '../styles/Home.module.css';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Token: NextPage = () => {
  const router = useRouter();
  const [showLeft, setShowLeft] = useState(true);
  const { currentAccount, loadingWalletTokens, walletTokens } =
    useWalletContext();
  const [
    getToken,
    { data: tokenData, loading: tokenLoading, refetch: refetchToken },
  ] = useTokenLazyQuery();
  /* const [searchToken, { data: searchTokenData, loading: searchTokenLoading }] =
    useSearchTokenLazyQuery(); */

  const tokenAddress = useMemo(() => {
    const { address } = router.query;

    let tokenAddress: string | undefined = undefined;

    if (address) {
      tokenAddress = address instanceof Array ? address.pop() : address;
    }

    return tokenAddress;
  }, [router.query]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (tokenAddress) {
        refetchToken({
          address: tokenAddress,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [tokenAddress, currentAccount]);

  useEffect(() => {
    if (tokenAddress && !tokenLoading) {
      getToken({
        variables: {
          address: tokenAddress,
        },
      });
    }
  }, [tokenAddress, tokenLoading]);

  if (!tokenAddress || !tokenData || !tokenData.token) {
    return null;
  }

  const token = tokenData.token;

  return (
    <Box w="full" mt={4}>
      <Box textAlign="center" w="full">
        <Image
          display="inline"
          src="//static.a-ads.com/a-ads-banners/329513/970x90?region=eu-central-1"
        />
      </Box>
      <Flex
        dir="row"
        flexWrap="wrap"
        w="full"
        mt={4}
        borderTop="1px solid rgba(255, 255, 255, 0.05)"
      >
        {showLeft && (
          <Box
            w="20%"
            px={6}
            pt={4}
            bg="rgba(255, 255, 255, 0.025)"
            borderRight="1px solid rgba(255, 255, 255, 0.05)"
          >
            <Flex
              dir="row"
              alignItems="center"
              borderBottom="1px solid rgba(255, 255, 255, 0.25)"
              pb={6}
            >
              <Icon as={BiInfoCircle} boxSize={6} mr={2} />
              <Heading size="md" fontWeight="500">
                TOKEN INFO
              </Heading>
            </Flex>

            <List spacing={4} pt={6}>
              <ListItem>
                Name: <Text fontWeight="600">{token.name}</Text>
              </ListItem>
              <ListItem>
                Symbol: <Text fontWeight="600">{token.symbol}</Text>
              </ListItem>
              <ListItem>
                Decimals:{' '}
                <Text fontWeight="600">{token.decimals.toString()}</Text>
              </ListItem>
              <ListItem>
                Contract:{' '}
                <a
                  href={`https://cronoscan.com/address/${token.address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Text fontWeight="600">
                    {token.address.slice(0, 14)}...
                    <Icon
                      pl={1}
                      pos="relative"
                      top={1}
                      boxSize={5}
                      display="inline"
                      as={BiLinkExternal}
                    />
                  </Text>
                </a>
              </ListItem>
              <ListItem>
                Price:
                <Text fontWeight="600">
                  {(+ethers.utils.formatUnits(
                    BigNumber.from(token.wcroPer),
                    token.decimals,
                  )).toFixed(6)}
                </Text>
              </ListItem>
              <ListItem>
                Price USD:
                <Text fontWeight="600">
                  $
                  {(+ethers.utils.formatUnits(
                    BigNumber.from(token.usdcPer),
                    6,
                  )).toFixed(6)}
                </Text>
              </ListItem>
            </List>
          </Box>
        )}
        <Box w="55%" px={6} pt={4}>
          <Flex dir="row" justifyContent="space-between">
            <Flex dir="row" alignItems="center">
              <Image src={token.iconUrl} h={10} mr={4} />

              <Box>
                <Heading size="md" fontWeight="500">
                  {token.name}{' '}
                  {!!token.basePair &&
                    `(${token.basePair!.token0.symbol}/${
                      token.basePair!.token1.symbol
                    })`}
                </Heading>

                <Heading size="sm" fontWeight="500" mt={1}>
                  $
                  {(+ethers.utils.formatUnits(
                    BigNumber.from(token.usdcPer),
                    6,
                  )).toFixed(6)}
                </Heading>
              </Box>
            </Flex>

            <Box w="30%">
              {/* <Search
                onSearch={(text) => router.replace(`/token/${text}`)}
                isLoading={searchTokenLoading}
                onTextUpdate={async (text) =>
                  searchToken({ variables: { text } }).then((result) =>
                    result.data!.searchToken.map((result) => ({
                      label: result.name,
                      value: result.address,
                    })),
                  )
                }
              /> */}
            </Box>
          </Flex>

          <Box w="full" mt={4}>
            <Chart
              type="candlestick"
              options={{
                chart: {
                  id: 'price',
                  toolbar: {
                    show: false,
                  },
                },
                xaxis: {
                  type: 'datetime',
                  labels: {
                    style: {
                      colors: '#ffffff',
                    },
                  },
                },
                yaxis: {
                  tooltip: {
                    enabled: true,
                  },
                  labels: {
                    style: {
                      colors: '#ffffff',
                    },
                  },
                },
              }}
              series={[
                {
                  data: (token.basePair
                    ? token.basePair
                    : { prices: [] }
                  ).prices.map((price) => ({
                    x: price.date,
                    y: [
                      parseFloat(
                        (+ethers.utils.formatUnits(
                          BigNumber.from(price.open),
                          token.decimals,
                        )).toFixed(4),
                      ),
                      parseFloat(
                        (+ethers.utils.formatUnits(
                          BigNumber.from(price.high),
                          token.decimals,
                        )).toFixed(4),
                      ),
                      parseFloat(
                        (+ethers.utils.formatUnits(
                          BigNumber.from(price.low),
                          token.decimals,
                        )).toFixed(4),
                      ),
                      parseFloat(
                        (+ethers.utils.formatUnits(
                          BigNumber.from(price.close),
                          token.decimals,
                        )).toFixed(4),
                      ),
                    ],
                  })),
                },
              ]}
              width="100%"
            />
          </Box>

          <Box h={72} overflowY="auto">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th isNumeric>Tokens</Th>
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Price per Token</Th>
                    <Th>Time</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {/* {token.basePair.transactions.map((tx) => (
                    <Tr key={tx.hash}>
                      <Td>
                        {token.address.toLowerCase() ===
                        tx.tokenIn!.toLowerCase()
                          ? 'Sell'
                          : 'Buy'}
                      </Td>
                      <Td isNumeric>
                        {token.address === tx.tokenIn
                          ? (+ethers.utils.formatUnits(
                              ethers.BigNumber.from(tx.amountIn),
                              token.decimals,
                            )).toFixed(4)
                          : (+ethers.utils.formatUnits(
                              ethers.BigNumber.from(tx.amountOut),
                              token.decimals,
                            )).toFixed(4)}
                      </Td>
                      <Td></Td>
                      <Td></Td>
                      <Td>
                        {format(
                          new Date(tx.date as unknown as string),
                          'h:mm:ss aaaa',
                        )}
                      </Td>
                      <Td>
                        <a
                          target="_blank"
                          href={`https://cronoscan.com/tx/${tx.hash}`}
                        >
                          View Tx
                        </a>
                      </Td>
                    </Tr>
                  ))} */}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box
          w="25%"
          px={6}
          pt={4}
          bg="rgba(255, 255, 255, 0.025)"
          borderLeft="1px solid rgba(255, 255, 255, 0.05)"
        >
          <Flex
            dir="row"
            alignItems="center"
            borderBottom="1px solid rgba(255, 255, 255, 0.25)"
            pb={6}
          >
            <Icon as={BiWallet} boxSize={6} mr={2} />
            <Heading size="md" fontWeight="500">
              MY TOKENS
            </Heading>
          </Flex>

          <Box mt={4}>
            {!loadingWalletTokens && walletTokens.length > 0 && (
              <Box>
                {orderBy(
                  walletTokens,
                  (token) => parseInt(token.usdcTotal, 10),
                  ['desc'],
                ).map((token, idx) => (
                  <Flex
                    key={token.address}
                    data-token={token.address}
                    dir="row"
                    mt={idx === 0 ? 0 : 4}
                    fontSize="xs"
                    _hover={{
                      bg: 'rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      router.push(
                        `/token/${
                          token.address === ADDRESS_CRO
                            ? ADDRESS_WCRO
                            : token.address
                        }`,
                      )
                    }
                    p={2}
                    borderBottom="1px solid rgba(255, 255, 255, 0.25)"
                  >
                    <Box w="50%">
                      <Text fontWeight="600">{token.symbol}</Text> {token.name}
                    </Box>
                    <Box w="50%">
                      <Text fontWeight="600">
                        $
                        {(+ethers.utils.formatUnits(
                          token.usdcTotal,
                          6,
                        )).toFixed(2)}
                      </Text>
                      <Text>
                        {(+ethers.utils.formatUnits(
                          token.balance,
                          token.decimals,
                        )).toFixed(4)}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Token;

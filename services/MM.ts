import { rpc } from './Wallet';

export const getSwapTransactions = async (
  pairAddress: string,
  startingBlock?: number,
) => {
  const blockNumber = startingBlock || (await rpc.getBlockNumber());

  const logs = await rpc.getLogs({
    fromBlock: blockNumber,
    toBlock: 'latest',
    address: pairAddress,
    topics: [
      '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
    ],
  });

  return logs;
};

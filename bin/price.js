const {
  Route,
  Trade,
  Pair,
  TradeType,
  CurrencyAmount,
  Currency,
  Token,
  TokenAmount,
} = require('@uniswap/sdk');
const ethers = require('ethers');
const { pack, keccak256 } = require('@ethersproject/solidity');
const { getCreate2Address } = require('@ethersproject/address');

(async () => {
  const CHAIN_ID = 25;
  const wcroAddress = '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23';
  const tokenA = new Token(
    CHAIN_ID,
    '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
    6,
    'USDC',
    'USDC',
  ); // USDC
  const tokenB = new Token(CHAIN_ID, wcroAddress, 18, 'WCRO', 'WCRO');
  // const pairAddress = Pair.getAddress(tokenB, tokenA);

  const INIT_CODE_HASH =
    '0x7ae6954210575e79ea2402d23bc6a59c4146a6e6296118aa8b99c747afec8acf';

  const [comp0, comp1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]; // does safety checks
  const pairAddress = getCreate2Address(
    '0xd590cc180601aecd6eeadd9b7f2b7611519544f4',
    keccak256(
      ['bytes'],
      [pack(['address', 'address'], [comp0.address, comp1.address])],
    ),
    INIT_CODE_HASH,
  );

  const api = new ethers.providers.JsonRpcProvider(
    'https://evm-cronos.crypto.org',
  );
  const contract = new ethers.Contract(
    pairAddress,
    [
      'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
      'function token0() external view returns (address)',
      'function token1() external view returns (address)',
    ],
    api,
  );
  const reserves = await contract.getReserves();
  const token0Address = await contract.token0();
  const token1Address = await contract.token1();
  const token0 = [tokenA, tokenB].find(
    (token) => token.address === token0Address,
  );
  const token1 = [tokenA, tokenB].find(
    (token) => token.address === token1Address,
  );
  const pair = new Pair(
    new TokenAmount(comp0, reserves.reserve0.toString()),
    new TokenAmount(comp1, reserves.reserve1.toString()),
  );

  const currencyA = new Currency(tokenA.decimals, tokenA.symbol, tokenA.name);
  const currencyB = new Currency(tokenB.decimals, tokenB.symbol, tokenB.name);

  const route = new Route([pair], token0, token1);

  // const currencyAmount = new CurrencyAmount(currencyA, '1000000000000000000');
  const tokenAmount = new TokenAmount(
    comp0,
    ethers.utils.parseUnits('1', comp0.decimals),
  );
  const trade = new Trade(route, tokenAmount, TradeType.EXACT_INPUT);
  console.log(
    'execution price',
    trade.executionPrice.toSignificant(comp0.decimals),
    ethers.utils
      .parseUnits(
        trade.executionPrice.toSignificant(comp0.decimals),
        comp0.decimals,
      )
      .toString(),
  );
})();

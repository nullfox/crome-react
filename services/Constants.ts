// Cronos chain
export const CRONOS_RPC_URL = 'https://evm-cronos.crypto.org';
export const CRONOS_RPC_API_URL = 'https://cronos.org/explorer/api';
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
  ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID, 10)
  : 25;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || CRONOS_RPC_URL;
export const IS_CRONOS = RPC_URL === CRONOS_RPC_URL;

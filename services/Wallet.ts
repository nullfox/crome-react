import WalletConnectProvider from '@walletconnect/web3-provider';
import { Signer, ethers, providers, utils } from 'ethers';
import Web3Modal from 'web3modal';

const CRONOS_RPC_URL = 'https://evm-cronos.crypto.org';
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
  ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID, 10)
  : 25;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || CRONOS_RPC_URL;
const IS_CRONOS = RPC_URL === CRONOS_RPC_URL;

const getModal = () =>
  new Web3Modal({
    network: IS_CRONOS ? 'cronos' : RPC_URL,
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            [CHAIN_ID]: RPC_URL,
          },
        },
      },
    },
  });

const onConnect = async (
  providerish: any,
): Promise<{
  provider: providers.Web3Provider;
  signer: Signer;
  address: string;
}> => {
  const web3Provider = new providers.Web3Provider(providerish);
  const signer = await web3Provider.getSigner();
  const address = await signer.getAddress();
  const chainId = await signer.getChainId();

  if (chainId !== CHAIN_ID) {
    try {
      await web3Provider.send('wallet_switchEthereumChain', [
        { chainId: utils.hexlify(CHAIN_ID) },
      ]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  providerish.on('accountsChanged', () => {
    window.location.reload();
  });
  providerish.on('chainChanged', () => {
    window.location.reload();
  });

  return {
    provider: web3Provider,
    signer,
    address,
  };
};

export const rpc = new providers.JsonRpcProvider(RPC_URL);

export const getCachedProvider = () =>
  localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER');

export const connect = async () => {
  const provider = await getModal().connect();

  return onConnect(provider);
};

export const disconnect = async () => {
  getModal().clearCachedProvider();
  localStorage.removeItem('walletconnect');
};

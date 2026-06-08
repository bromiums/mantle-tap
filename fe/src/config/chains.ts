import { defineChain } from 'viem';

export const MANTLE_SEPOLIA_RPC =
  process.env.NEXT_PUBLIC_RPC_URL || 'https://5003.rpc.thirdweb.com';

export const mantleSepolia = defineChain({
  id: 5003,
  name: 'Mantle Sepolia',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: [MANTLE_SEPOLIA_RPC] },
  },
  blockExplorers: {
    default: { name: 'Mantle Sepolia Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
  },
  testnet: true,
});

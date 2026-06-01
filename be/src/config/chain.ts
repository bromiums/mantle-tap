export const MANTLE_SEPOLIA = {
  id: 5003,
  name: 'Mantle Sepolia',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: { default: { http: [process.env.RPC_URL ?? 'https://rpc.sepolia.mantle.xyz'] } },
} as const;

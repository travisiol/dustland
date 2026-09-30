import { base, baseSepolia, mainnet } from "viem/chains";
import type { Chain } from "viem";

/*
 * The chain is picked by id from a short allow-list, so a typo in an env
 * var fails loudly at build rather than pointing wallets at a network that
 * does not exist. Base is the default: cheap enough that a daily check-in
 * is not dominated by gas.
 */
const supported: Record<number, Chain> = {
  [base.id]: base,
  [baseSepolia.id]: baseSepolia,
  [mainnet.id]: mainnet,
};

const requestedId = Number(process.env.NEXT_PUBLIC_STREAK_CHAIN_ID ?? base.id);

if (!supported[requestedId]) {
  throw new Error(
    `NEXT_PUBLIC_STREAK_CHAIN_ID=${requestedId} is not supported. Use one of: ${Object.keys(supported).join(", ")}.`,
  );
}

const picked = supported[requestedId];
const rpcOverride = process.env.NEXT_PUBLIC_STREAK_RPC_URL;

export const gameChain: Chain = rpcOverride
  ? {
      ...picked,
      rpcUrls: {
        ...picked.rpcUrls,
        default: { http: [rpcOverride] },
      },
    }
  : picked;

export const explorerUrl = gameChain.blockExplorers?.default.url ?? null;

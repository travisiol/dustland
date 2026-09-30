/*
 * The contract surface this app expects. Specced around the pages rather
 * than the other way round: the docket needs a list and per-token facts,
 * the launch page needs the fee config and geometry, the token page needs
 * a pool to quote against. If the deployed contracts name these
 * differently, this file is the only thing to change.
 */

export const launchpadAbi = [
  {
    type: "function",
    name: "createToken",
    stateMutability: "payable",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "metadataURI", type: "string" },
      { name: "minTokensOut", type: "uint256" },
      { name: "poolFee", type: "uint24" },
      { name: "feeRecipient", type: "address" },
    ],
    outputs: [{ name: "token", type: "address" }],
  },
  {
    type: "function",
    name: "tokenCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "getTokens",
    stateMutability: "view",
    inputs: [
      { name: "offset", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
    outputs: [{ type: "address[]" }],
  },
  {
    type: "function",
    name: "tokens",
    stateMutability: "view",
    inputs: [{ name: "token", type: "address" }],
    outputs: [
      { name: "creator", type: "address" },
      { name: "creatorLpShareBps", type: "uint16" },
      { name: "poolFee", type: "uint24" },
      { name: "pool", type: "address" },
      { name: "positionId", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "feeConfig",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "creatorLpShareBps", type: "uint16" },
      { name: "creationFee", type: "uint96" },
    ],
  },
  {
    type: "function",
    name: "startSqrtPriceX96",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint160" }],
  },
  {
    type: "event",
    name: "TokenCreated",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "pool", type: "address", indexed: true },
      { name: "positionId", type: "uint256", indexed: false },
      { name: "name", type: "string", indexed: false },
      { name: "symbol", type: "string", indexed: false },
      { name: "metadataURI", type: "string", indexed: false },
      { name: "creatorLpShareBps", type: "uint16", indexed: false },
      { name: "poolFee", type: "uint24", indexed: false },
    ],
  },
] as const;

export const routerAbi = [
  {
    type: "function",
    name: "buy",
    stateMutability: "payable",
    inputs: [
      { name: "pool", type: "address" },
      { name: "minTokensOut", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
    outputs: [{ name: "tokensOut", type: "uint256" }],
  },
  {
    type: "function",
    name: "sell",
    stateMutability: "nonpayable",
    inputs: [
      { name: "pool", type: "address" },
      { name: "tokenAmount", type: "uint256" },
      { name: "minEthOut", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
    outputs: [{ name: "ethOut", type: "uint256" }],
  },
] as const;

export const lockerAbi = [
  {
    type: "function",
    name: "collectFees",
    stateMutability: "nonpayable",
    inputs: [{ name: "token", type: "address" }],
    outputs: [
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" },
    ],
  },
] as const;

export const erc20Abi = [
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

/** Uniswap v3 pool: the one read the token page needs for a price. */
export const poolAbi = [
  {
    type: "function",
    name: "slot0",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "sqrtPriceX96", type: "uint160" },
      { name: "tick", type: "int24" },
      { name: "observationIndex", type: "uint16" },
      { name: "observationCardinality", type: "uint16" },
      { name: "observationCardinalityNext", type: "uint16" },
      { name: "feeProtocol", type: "uint8" },
      { name: "unlocked", type: "bool" },
    ],
  },
] as const;

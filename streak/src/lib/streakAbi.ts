/*
 * The contract this page expects. Specced from the page rather than the
 * other way round: every read below is one call the UI makes, and nothing
 * is read that the UI does not show.
 *
 * Days are UTC day indexes: floor(block.timestamp / 86400). The page
 * computes the same number locally, so "today" agrees on both sides.
 */
export const streakAbi = [
  {
    type: "function",
    name: "checkIn",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "entryFee",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "currentDay",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "streakOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [
      { name: "length", type: "uint256" },
      { name: "lastDay", type: "uint256" },
      { name: "staked", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "stats",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "alive", type: "uint256" },
      { name: "longest", type: "uint256" },
      { name: "pot", type: "uint256" },
      { name: "brokenToday", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "leaderboard",
    stateMutability: "view",
    inputs: [{ name: "n", type: "uint256" }],
    outputs: [
      { name: "accounts", type: "address[]" },
      { name: "lengths", type: "uint256[]" },
    ],
  },
  {
    type: "event",
    name: "CheckedIn",
    inputs: [
      { name: "account", type: "address", indexed: true },
      { name: "day", type: "uint256", indexed: false },
      { name: "length", type: "uint256", indexed: false },
    ],
  },
] as const;

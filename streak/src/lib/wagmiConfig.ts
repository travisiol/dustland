import { createConfig, http, injected } from "wagmi";
import { gameChain } from "@/lib/chain";

export const wagmiConfig = createConfig({
  chains: [gameChain],
  connectors: [injected()],
  transports: {
    [gameChain.id]: http(),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

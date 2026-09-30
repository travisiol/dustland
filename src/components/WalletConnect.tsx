"use client";

import { useEffect, useState } from "react";
import { useConnect, useConnection, useDisconnect, useSwitchChain } from "wagmi";
import { clsx } from "clsx";
import { gameChain } from "@/lib/chain";
import { shortAddress } from "@/lib/format";

/**
 * Whether a wallet is actually reachable in this browser.
 *
 * wagmi always registers the injected connector whether or not anything is
 * there to inject, so its presence says nothing. This looks for a real
 * provider instead: `window.ethereum` for older wallets, and the EIP-6963
 * announcement that current ones use. Starts optimistic so the server
 * render and the first client render agree, then corrects itself.
 */
export function useWalletAvailable(): boolean {
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let found = typeof window !== "undefined" && "ethereum" in window;

    const onAnnounce = () => {
      found = true;
      setAvailable(true);
    };
    window.addEventListener("eip6963:announceProvider", onAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    const timer = window.setTimeout(() => setAvailable(found), 400);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("eip6963:announceProvider", onAnnounce);
    };
  }, []);

  return available;
}

const shell =
  "type-label inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 transition-colors duration-150";

export function WalletConnect({
  className,
  size = "sm",
  hint = true,
}: {
  className?: string;
  size?: "sm" | "lg";
  /** Explain a refused or impossible connection under the button. Off in the header, where there is no room. */
  hint?: boolean;
}) {
  const { address, isConnected, chainId } = useConnection();
  const {
    connect,
    connectors,
    isPending: isConnecting,
    error: connectError,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { mutate: switchChain, isPending: isSwitching } = useSwitchChain();
  const walletAvailable = useWalletAvailable();

  const sizing = size === "lg" ? "px-6 py-4" : "";

  if (isConnected && address) {
    if (chainId !== gameChain.id) {
      return (
        <button
          type="button"
          onClick={() => switchChain({ chainId: gameChain.id })}
          disabled={isSwitching}
          className={clsx(shell, sizing, "bg-ember text-ember-white hover:bg-ember-deep", className)}
        >
          {isSwitching ? "Switching…" : `Switch to ${gameChain.name}`}
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        title="Disconnect wallet"
        className={clsx(
          shell,
          sizing,
          "text-ink ring-1 ring-line-strong ring-inset hover:bg-ink hover:text-paper",
          className,
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ember" />
        {shortAddress(address)}
      </button>
    );
  }

  const connector = connectors[0];
  const canConnect = walletAvailable && !!connector;

  return (
    <span className="inline-flex flex-col items-start gap-1.5">
      <button
        type="button"
        disabled={!canConnect || isConnecting}
        onClick={() => connector && connect({ connector })}
        title={canConnect ? undefined : "No browser wallet detected on this device"}
        className={clsx(
          shell,
          sizing,
          "bg-ink text-paper hover:bg-ink-soft disabled:cursor-not-allowed disabled:bg-transparent disabled:text-ink-muted disabled:ring-1 disabled:ring-line-strong disabled:ring-inset",
          className,
        )}
      >
        {isConnecting ? "Connecting…" : canConnect ? "Connect wallet" : "No wallet found"}
      </button>

      {hint && connectError && (
        <span className="type-data max-w-[260px] text-loss">
          {connectError.message.split("\n")[0]}
        </span>
      )}
      {hint && !canConnect && !connectError && (
        <span className="type-data max-w-[260px] text-ink-muted">
          Install a browser wallet to connect.
        </span>
      )}
    </span>
  );
}

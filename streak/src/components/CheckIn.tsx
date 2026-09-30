"use client";

import { useEffect } from "react";
import { clsx } from "clsx";
import {
  useConnection,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "@/components/ui/Button";
import { WalletConnect } from "@/components/WalletConnect";
import { gameChain } from "@/lib/chain";
import { useGame } from "@/lib/gameState";
import { eth } from "@/lib/format";
import { gameConfig } from "@/lib/site-config";
import { streakAbi } from "@/lib/streakAbi";

/*
 * The one button on the page.
 *
 * It reads its own state from the game: pre-launch it is disabled and says
 * so; disconnected it becomes the connect control; on the wrong chain it
 * offers the switch; once you have checked in today it turns into a
 * receipt. It never looks live while doing nothing.
 */
export function CheckIn({
  className,
  size = "lg",
}: {
  className?: string;
  size?: "lg" | "md";
}) {
  const game = useGame();
  const { isConnected, chainId } = useConnection();
  const { mutate: switchChain, isPending: isSwitching } = useSwitchChain();
  const {
    writeContract,
    data: hash,
    isPending: isSigning,
    error: writeError,
    reset,
  } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (receipt.isSuccess) {
      game.refetch();
      reset();
    }
    // The game object changes every poll; only the receipt matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt.isSuccess]);

  const sizing = size === "lg" ? "w-full px-8 py-5 sm:w-auto" : "w-full";

  if (!game.live) {
    return (
      <div className={clsx("flex flex-col gap-2", className)}>
        <Button disabled className={sizing}>
          Check-ins open at launch
        </Button>
        <span className="type-data text-ink-muted">
          The contract is not deployed yet. Connect now and this turns on by itself.
        </span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className={clsx("flex flex-col gap-2", className)}>
        <WalletConnect size="lg" className={clsx(sizing, "bg-ember hover:bg-ember-deep")} />
        <span className="type-data text-ink-muted">Connect a wallet to check in.</span>
      </div>
    );
  }

  if (chainId !== gameChain.id) {
    return (
      <Button
        className={clsx(sizing, className)}
        disabled={isSwitching}
        onClick={() => switchChain({ chainId: gameChain.id })}
      >
        {isSwitching ? "Switching…" : `Switch to ${gameChain.name}`}
      </Button>
    );
  }

  if (game.myStatus === "done") {
    return (
      <div className={clsx("flex flex-col gap-2", className)}>
        <Button variant="outline" disabled className={sizing}>
          <span className="h-1.5 w-1.5 rounded-full bg-ember" />
          Checked in today
        </Button>
        <span className="type-data text-ink-muted">
          Day {game.me?.length ?? 0} is on the wall. Come back after the reset.
        </span>
      </div>
    );
  }

  const nextDay = game.myStatus === "due" ? (game.me?.length ?? 0) + 1 : 1;
  const fee = game.entryFeeWei;
  const busy = isSigning || receipt.isLoading;

  const submit = () => {
    if (!gameConfig.contractAddress || fee === null) return;
    writeContract({
      abi: streakAbi,
      address: gameConfig.contractAddress,
      functionName: "checkIn",
      value: fee,
      chainId: gameChain.id,
    });
  };

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <Button
        className={clsx(sizing, !busy && "pulse")}
        disabled={busy || fee === null}
        onClick={submit}
      >
        {isSigning
          ? "Confirm in wallet…"
          : receipt.isLoading
            ? "Writing to chain…"
            : `Check in · day ${nextDay}`}
      </Button>
      <span className="type-data text-ink-muted">
        {fee !== null ? `${eth(fee)} ETH into the pot, plus gas.` : "Reading the entry fee…"}
        {game.myStatus === "dead" && " Your last streak died; this starts a new one."}
      </span>
      {writeError && (
        <span className="type-data max-w-[40ch] text-loss">
          {writeError.message.split("\n")[0]}
        </span>
      )}
    </div>
  );
}

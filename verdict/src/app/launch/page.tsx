import type { Metadata } from "next";
import { LaunchForm } from "@/components/LaunchForm";

export const metadata: Metadata = {
  title: "Launch a token",
  description: "One transaction, one flat fee. Your token deploys into a live Uniswap pool with its liquidity sealed forever.",
};

export default function LaunchPage() {
  return <LaunchForm />;
}

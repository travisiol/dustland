import type { Metadata } from "next";
import { CaseFile } from "@/components/CaseFile";
import { previewTokenByAddress } from "@/lib/preview";
import { isLive } from "@/lib/site-config";
import { shortAddress } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/t/[address]">): Promise<Metadata> {
  const { address } = await params;
  const sample = isLive ? undefined : previewTokenByAddress(address);
  const title = sample ? `${sample.name} ($${sample.symbol})` : `Token ${shortAddress(address)}`;
  return {
    title,
    description: sample?.description || "A token filed on the launchpad: live pool, sealed liquidity, public record.",
  };
}

export default async function TokenPage({ params }: PageProps<"/t/[address]">) {
  const { address } = await params;
  return <CaseFile address={address} />;
}

import type { Metadata } from "next";
import { Studio } from "@/components/Studio";

export const metadata: Metadata = {
  title: "Studio",
  description: "Your filings and your fee stream. Claim accrued swap fees in one signature.",
};

export default function StudioPage() {
  return <Studio />;
}

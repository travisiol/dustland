import type { Metadata } from "next";
import { Docket } from "@/components/Docket";

export const metadata: Metadata = {
  title: "The docket",
  description: "Every token filed on the launchpad, in launch order. Search, sort, and open a case file.",
};

export default function TokensPage() {
  return <Docket />;
}

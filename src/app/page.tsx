import { Hero } from "@/components/landing/Hero";
import { Ticker } from "@/components/Ticker";
import { Guarantees } from "@/components/landing/Guarantees";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { NeverTable } from "@/components/landing/NeverTable";
import { DocketPreview } from "@/components/landing/DocketPreview";
import { Creators } from "@/components/landing/Creators";
import { ProtocolToken } from "@/components/landing/ProtocolToken";
import { Faq } from "@/components/landing/Faq";

export default function Home() {
  return (
    <>
      <Ticker />
      <Hero />
      <Guarantees />
      <HowItWorks />
      <DocketPreview />
      <NeverTable />
      <Creators />
      <ProtocolToken />
      <Faq />
    </>
  );
}

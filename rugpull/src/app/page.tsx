import { BuyPanel } from "@/components/BuyPanel";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Record } from "@/components/Record";
import { Terms } from "@/components/Terms";
import { Ticker } from "@/components/Ticker";

/*
 * One page, one number, in order: the notice, the terms, how it goes, what
 * has happened so far (nothing), where to buy, and the questions.
 */
export default function Home() {
  return (
    <>
      <Ticker />
      <Hero />
      <Terms />
      <HowItWorks />
      <Record />
      <BuyPanel />
      <Faq />
      <Footer />
    </>
  );
}

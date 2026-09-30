import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Leaderboard } from "@/components/Leaderboard";
import { Rules } from "@/components/Rules";
import { Stats } from "@/components/Stats";
import { Ticker } from "@/components/Ticker";

/*
 * One page, read top to bottom: the pitch and the wall, the rules in one
 * line, the readings, how it works, the rules in full, the board, the
 * questions. Every section is one scroll from the check-in button.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Stats />
      <HowItWorks />
      <Rules />
      <Leaderboard />
      <Faq />
      <Footer />
    </>
  );
}

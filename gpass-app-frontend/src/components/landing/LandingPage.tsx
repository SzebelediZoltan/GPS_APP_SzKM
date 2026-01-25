import HeroSection from "./HeroSection"
import FeaturesSection from "./FeaturesSection"
import BentoSection from "./BentoSection"
import PricingSection from "./PricingSection"
import FaqSection from "./FaqSection"
import CtaSection from "./CtaSection"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-520px w-520px -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.18),transparent_60%)] blur-2xl" />
        <div className="absolute -bottom-48 -right-30px h-520px w-520px rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--ring)/0.20),transparent_60%)] blur-2xl" />
      </div>

      <HeroSection />
      <FeaturesSection />
      <BentoSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </main>
  )
}

import HeroSection from "./HeroSection"
import FeaturesSection from "./FeaturesSection"
import BentoSection from "./BentoSection"
import PricingSection from "./PricingSection"
import FaqSection from "./FaqSection"
import CtaSection from "./CtaSection"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Base dark gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-20"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary)/0.06) 0%, transparent 70%)" }}
      />

      <HeroSection />

      {/* Section divider */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
      </div>

      <FeaturesSection />

      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
      </div>

      <BentoSection />
      <PricingSection />

      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
      </div>

      <FaqSection />
      <CtaSection />
    </main>
  )
}

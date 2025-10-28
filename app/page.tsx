import { HeroSection } from "@/components/hero-section"
import { Navigation } from "@/components/navigation"
import { DemoSection } from "@/components/demo-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen gradient-background">
      <Navigation />
      <main>
        <HeroSection />
        <DemoSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}

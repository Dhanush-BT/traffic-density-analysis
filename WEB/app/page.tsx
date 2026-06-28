import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { ProblemSection } from "@/components/sections/problem"
import { SolutionSection } from "@/components/sections/solution"
import { HowItWorksSection } from "@/components/sections/how-it-works"
import { FeaturesSection } from "@/components/sections/features"
import { BenefitsSection } from "@/components/sections/benefits"
import { SDGSection } from "@/components/sections/sdg"
import { DemoSection } from "@/components/sections/demo"
import { FutureScopeSection } from "@/components/sections/future-scope"
import { TeamSection } from "@/components/sections/team"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
        <BenefitsSection />
        <SDGSection />
        <DemoSection />
        <FutureScopeSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  )
}

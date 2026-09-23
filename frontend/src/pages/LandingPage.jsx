import Hero from '../features/landing/Hero.jsx'
import TrustStatement from '../features/landing/TrustStatement.jsx'
import ProblemTimeline from '../features/landing/ProblemTimeline.jsx'
import HowItWorks from '../features/landing/HowItWorks.jsx'
import FeatureShowcase from '../features/landing/FeatureShowcase.jsx'
import AdaptiveResponseSection from '../features/landing/AdaptiveResponseSection.jsx'
import MultiAgentSection from '../features/landing/MultiAgentSection.jsx'
import HumanControlSection from '../features/landing/HumanControlSection.jsx'
import SimulationSection from '../features/landing/SimulationSection.jsx'
import ContactSection from '../features/landing/ContactSection.jsx'
import FinalCTA from '../features/landing/FinalCTA.jsx'

// Section order follows the navbar: Home → About → Features → How it works → Contact.
export default function LandingPage() {
  return (
    <>
      <Hero />

      <TrustStatement />
      <ProblemTimeline />

      <FeatureShowcase />
      <AdaptiveResponseSection />
      <MultiAgentSection />
      <HumanControlSection />

      <HowItWorks />
      <SimulationSection />

      <ContactSection />
      <FinalCTA />
    </>
  )
}

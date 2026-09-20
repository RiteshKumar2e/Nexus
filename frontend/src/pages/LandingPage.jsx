import Hero from '../features/landing/Hero.jsx'
import TrustStatement from '../features/landing/TrustStatement.jsx'
import ProblemTimeline from '../features/landing/ProblemTimeline.jsx'
import HowItWorks from '../features/landing/HowItWorks.jsx'
import FeatureShowcase from '../features/landing/FeatureShowcase.jsx'
import AdaptiveResponseSection from '../features/landing/AdaptiveResponseSection.jsx'
import MultiAgentSection from '../features/landing/MultiAgentSection.jsx'
import HumanControlSection from '../features/landing/HumanControlSection.jsx'
import SimulationSection from '../features/landing/SimulationSection.jsx'
import FinalCTA from '../features/landing/FinalCTA.jsx'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustStatement />
      <ProblemTimeline />
      <HowItWorks />
      <FeatureShowcase />
      <AdaptiveResponseSection />
      <MultiAgentSection />
      <HumanControlSection />
      <SimulationSection />
      <FinalCTA />
    </>
  )
}

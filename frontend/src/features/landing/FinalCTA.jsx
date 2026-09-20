import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import '../../styles/FinalCTA.css'

export default function FinalCTA() {
  return (
    <section className="finalcta-section">
      <div className="container-page finalcta-inner">
        <h2>Build a response that can adapt.</h2>
        <p>
          Launch the command center and see how NEXUS turns changing conditions into coordinated action.
        </p>
        <div className="finalcta-actions">
          <Link to="/register" className="btn btn-primary">
            Launch Command Center <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
          <a href="#simulation" className="btn btn-secondary">
            View Simulation
          </a>
        </div>
      </div>
    </section>
  )
}

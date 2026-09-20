import { ShieldCheck } from 'lucide-react'
import '../../styles/HumanControlSection.css'

export default function HumanControlSection() {
  return (
    <section className="human-section">
      <div className="container-page human-grid">
        <div className="human-text">
          <p className="human-eyebrow"><ShieldCheck /> Human oversight</p>
          <h2>
            AI recommends.
            <br />
            People remain in control.
          </h2>
          <p>
            NEXUS is a decision-support platform, not an autonomous controller. Authorized
            operators retain control over every operational decision the system recommends.
          </p>
        </div>

        <div className="card human-card">
          <p className="section-label" style={{ marginBottom: 8 }}>AI Recommendation</p>
          <p>
            Reassign Team Alpha to Zone B via R3 and R7. Road R1 is blocked, so estimated
            arrival moves from 8 minutes to 14.
          </p>
          <div className="human-card-actions">
            <button className="btn btn-primary">Approve</button>
            <button className="btn btn-secondary">Modify</button>
            <button className="btn btn-secondary">Reject</button>
          </div>
        </div>
      </div>
    </section>
  )
}

import { ArrowIcon } from './icons.jsx'
import '../../styles/FeatureShowcase.css'

export default function FeatureShowcase() {
  return (
    <section className="features-section" id="features">
      <div className="container-page">
        <div className="features-intro">
          <p className="section-label">Capabilities</p>
          <h2>Everything an operations team needs, in one system.</h2>
        </div>

        <div className="features-grid">
          {/* Live Situation Map */}
          <div className="card feature-card feature-card-wide">
            <div className="feature-card-wide-inner">
              <div className="feature-card-wide-text">
                <h3>Live Situation Map</h3>
                <p>
                  Every incident, road, response team, medical unit, and relief camp plotted on a single
                  operational map that updates as the situation evolves.
                </p>
              </div>
              <div className="feature-mini-map">
                <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%' }}>
                  <rect width="500" height="200" fill="#F1EBD8" />
                  <path d="M30 160 L180 100 L280 120 L470 40" stroke="#C9C2AF" strokeWidth="4" fill="none" />
                  <circle cx="180" cy="100" r="7" fill="#A83A3A" />
                  <circle cx="280" cy="120" r="6" fill="#C97A2E" />
                  <circle cx="30" cy="160" r="6" fill="#C89B3C" />
                  <circle cx="470" cy="40" r="6" fill="#4F7EA8" />
                  <circle cx="380" cy="150" r="6" fill="#4B7A52" />
                </svg>
              </div>
            </div>
          </div>

          {/* Adaptive Planning */}
          <div className="card feature-card">
            <h3>Adaptive Planning</h3>
            <p>
              When a route or resource becomes unavailable, the active plan is invalidated and a
              new one is generated in its place.
            </p>
            <div className="feature-plan-row">
              <span className="badge badge-neutral badge-strike">Plan 17</span>
              <ArrowIcon style={{ width: 14, height: 14, color: 'var(--ink-300)' }} />
              <span className="badge badge-success">Plan 18 Activated</span>
            </div>
          </div>

          {/* Resource Intelligence */}
          <div className="card feature-card">
            <h3>Resource Intelligence</h3>
            <p>
              Ambulances, rescue teams, water, food, and medical supplies, tracked with live
              allocation and consumption.
            </p>
            <div className="feature-tag-row">
              {['Ambulances', 'Rescue Teams', 'Water', 'Food', 'Medical'].map((t) => (
                <span key={t} className="badge badge-neutral">{t}</span>
              ))}
            </div>
          </div>

          {/* AI Response Copilot */}
          <div className="card feature-card">
            <h3>AI Response Copilot</h3>
            <p>Natural-language questions, answered from live operational data.</p>
            <div className="feature-chat-box">
              "What needs immediate attention?"
            </div>
          </div>

          {/* Human Oversight */}
          <div className="card feature-card">
            <h3>Human Oversight</h3>
            <p>Every AI recommendation waits for an operator before it becomes an action.</p>
            <div className="feature-approval-row">
              <span className="btn btn-secondary">Approve</span>
              <span className="btn btn-secondary">Modify</span>
              <span className="btn btn-secondary">Reject</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

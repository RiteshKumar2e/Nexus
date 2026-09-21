import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Waves, HeartPulse, Home, TriangleAlert } from 'lucide-react'
import '../../styles/SimulationSection.css'

const EVENTS = [
  { key: 'road', icon: TriangleAlert, label: 'Trigger Road Block' },
  { key: 'hospital', icon: HeartPulse, label: 'Medical Unit Critical' },
  { key: 'shelter', icon: Home, label: 'Fill Relief Camp' },
  { key: 'flood', icon: Waves, label: 'Increase Flood' },
]

export default function SimulationSection() {
  const [log, setLog] = useState(['Simulation idle. Press Start to begin.'])

  function fire(label) {
    setLog((l) => [`${new Date().toLocaleTimeString('en-IN', { hour12: false })} — ${label}`, ...l].slice(0, 5))
  }

  return (
    <section className="simsection" id="simulation">
      <div className="container-page simsection-grid">
        <div className="simsection-text">
          <p className="section-label">Simulation</p>
          <h2>Test the system before the real emergency.</h2>
          <p>
            NEXUS ships with a full disaster simulation environment. Trigger events, watch the
            engine detect conflicts, and see the response plan adapt in real time &mdash; all
            before it's ever needed in the field.
          </p>
          <Link to="/register" className="btn btn-primary">
            <Play style={{ width: 16, height: 16 }} /> Start Simulation
          </Link>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <p className="simsection-panel-title">Event Console Preview</p>
          <div className="simsection-buttons">
            {EVENTS.map((e) => (
              <button key={e.key} onClick={() => fire(e.label)} className="simsection-event-btn">
                <e.icon style={{ width: 14, height: 14, color: 'var(--brand-600)' }} />
                {e.label}
              </button>
            ))}
          </div>
          <div className="simsection-console">
            {log.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

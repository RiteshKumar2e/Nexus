import '../../styles/ProblemTimeline.css'

const EVENTS = [
  { time: '09:40', label: 'Road Open', tone: 'neutral' },
  { time: '09:45', label: 'Flood Rising', tone: 'warning' },
  { time: '09:49', label: 'Road Blocked', tone: 'critical' },
  { time: '09:51', label: 'Hospital Overloaded', tone: 'critical' },
  { time: '09:53', label: 'Plan Invalid', tone: 'critical' },
  { time: '09:54', label: 'New Plan Activated', tone: 'success' },
]

export default function ProblemTimeline() {
  return (
    <section className="timeline-section">
      <div className="container-page">
        <div className="timeline-intro">
          <p className="section-label">The problem</p>
          <h2>Disaster response is a moving target.</h2>
          <p>
            A road can become blocked. A hospital can reach capacity. A shelter can become full.
            A rescue team can become unavailable. A fixed response plan can quickly become
            outdated — often before it's even fully executed.
          </p>
        </div>

        <div className="timeline-scroll">
          <div className="timeline-track">
            {EVENTS.map((e, i) => (
              <div key={e.time} className="timeline-node">
                {i !== 0 && <div className="timeline-connector" />}
                <div className={`timeline-dot timeline-dot-${e.tone}`} />
                <p className="timeline-time">{e.time}</p>
                <p className="timeline-label">{e.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

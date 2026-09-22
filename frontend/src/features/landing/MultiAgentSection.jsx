import '../../styles/MultiAgentSection.css'

const AGENTS = [
  { name: 'Situation Agent', angle: -90 },
  { name: 'Risk Agent', angle: -30 },
  { name: 'Route Agent', angle: 30 },
  { name: 'Resource Agent', angle: 90 },
  { name: 'Planning Agent', angle: 150 },
  { name: 'Replanning Agent', angle: 210 },
]

export default function MultiAgentSection() {
  return (
    <section className="agents-section" id="technology">
      <div className="container-page agents-grid">
        <div className="agents-intro">
          <p className="section-label">Multi-agent architecture</p>
          <h2>Specialized agents, one coordinated core.</h2>
          <p>
            Each agent focuses on a single concern &mdash; situation analysis, risk, routing,
            resources, planning, and replanning &mdash; and reports into the NEXUS core, which
            reconciles their output into a single response plan.
          </p>
          <ul className="agents-list">
            {AGENTS.map((a) => (
              <li key={a.name}>
                <span className="agents-list-dot" />
                {a.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="agents-diagram">
          <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
            {AGENTS.map((a) => {
              const rad = (a.angle * Math.PI) / 180
              const x = 200 + Math.cos(rad) * 150
              const y = 200 + Math.sin(rad) * 150
              return <line key={a.name} x1="200" y1="200" x2={x} y2={y} style={{ stroke: 'var(--ink-100)' }} strokeWidth="2" />
            })}
            <circle cx="200" cy="200" r="56" style={{ fill: 'var(--ink-900)' }} />
            <text x="200" y="196" textAnchor="middle" style={{ fill: 'var(--bg-surface)' }} fontSize="13" fontWeight="700">NEXUS</text>
            <text x="200" y="212" textAnchor="middle" style={{ fill: 'var(--bg-surface)' }} fontSize="10" fontWeight="600">CORE</text>
            {AGENTS.map((a) => {
              const rad = (a.angle * Math.PI) / 180
              const x = 200 + Math.cos(rad) * 150
              const y = 200 + Math.sin(rad) * 150
              return <circle key={a.name} cx={x} cy={y} r="7" style={{ fill: 'var(--brand-600)' }} />
            })}
          </svg>
          {AGENTS.map((a) => {
            const rad = (a.angle * Math.PI) / 180
            const x = 50 + Math.cos(rad) * 39
            const y = 50 + Math.sin(rad) * 39
            return (
              <div
                key={a.name}
                className="agents-diagram-label"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {a.name}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

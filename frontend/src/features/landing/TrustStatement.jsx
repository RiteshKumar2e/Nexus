import '../../styles/TrustStatement.css'

const POINTS = [
  {
    title: 'Real-time situational awareness',
    description: 'A continuously updated picture of incidents, routes, teams, and capacity, not a briefing someone put together an hour ago.',
  },
  {
    title: 'Adaptive response planning',
    description: 'When conditions change, the current plan gets re-evaluated and an alternative is generated automatically.',
  },
  {
    title: 'Human-controlled AI decisions',
    description: 'Every recommendation is reviewed by an authorized operator before it becomes an operational action.',
  },
]

export default function TrustStatement() {
  return (
    <section className="trust-section" id="about">
      <div className="container-page trust-layout">
        <h2 className="trust-heading">
          Built for situations where static plans stop working.
        </h2>
        <div className="trust-list">
          {POINTS.map((p) => (
            <div key={p.title} className="trust-row">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import '../../styles/HowItWorks.css'

const STEPS = [
  { n: '01', title: 'Observe', description: 'Continuously collect changing incident, route, resource, and capacity information.' },
  { n: '02', title: 'Understand', description: 'AI analyzes the current operational situation across every active zone.' },
  { n: '03', title: 'Adapt', description: 'The system identifies when the current response plan is no longer valid.' },
  { n: '04', title: 'Coordinate', description: 'New recommendations are generated for authorized operators to act on.' },
]

export default function HowItWorks() {
  return (
    <section className="howworks-section" id="how-it-works">
      <div className="container-page">
        <div className="howworks-intro">
          <p className="section-label">How NEXUS works</p>
          <h2>From raw signal to coordinated action.</h2>
        </div>
        <div className="howworks-grid">
          {STEPS.map((s) => (
            <div key={s.n} className="howworks-card">
              <span className="howworks-number">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

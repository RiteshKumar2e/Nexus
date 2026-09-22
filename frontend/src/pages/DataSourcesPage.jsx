import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const SOURCES = [
  'Government of Bihar',
  'Bihar Disaster Management Department',
  'Bihar State Disaster Management Authority',
  'Bihar Water Resources Department',
]

export default function DataSourcesPage() {
  useDocumentTitle('Data Sources')

  return (
    <div className="page page-max-5xl" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <h1 className="page-title" style={{ marginBottom: 32 }}>Data Sources</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.7, maxWidth: 720 }}>
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>Verified Public Information</h2>
          <p>
            Publicly reported Bihar flood information — affected districts, the general September 2026 flood
            situation along the Ganga, Kosi, Bagmati, and Gandak river systems, and the agencies involved in
            response — is used for scenario context. Where a statistic on this platform is traceable to a
            public report, it is marked <strong>Verified Public Information</strong> with a source reference.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {SOURCES.map((s) => <span key={s} className="badge badge-neutral">{s}</span>)}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>Simulated Response Data</h2>
          <p>
            Operational response records shown in this prototype — incident details, team dispatch status,
            medical unit and relief camp status, resource pools, community kitchen supply levels, and routing —
            are <strong>simulated for demonstration purposes</strong>. They illustrate how an adaptive coordination
            platform would function during a real flood response, but they are not live government data and do not
            represent real-time reporting from any agency. These values are marked <strong>Response Simulation</strong> or{' '}
            <strong>Simulated Response Data</strong> throughout the platform.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>Why this distinction matters</h2>
          <p>
            This platform is built as a hackathon demonstration of adaptive, multi-agent disaster-response
            coordination. To avoid presenting fabricated operational numbers as if they were official reporting,
            every dashboard, table, and map marker distinguishes verified public context from simulated
            operational figures.
          </p>
        </section>
      </div>
    </div>
  )
}

import { Info, ShieldCheck, FlaskConical } from 'lucide-react'
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
    <div className="page page-max-5xl">
      <h1 className="page-title"><Info /> Data Sources</h1>

      <div className="card detail-section-card">
        <p className="detail-section-title"><ShieldCheck /> Verified Public Information</p>
        <p style={{ fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.7 }}>
          Publicly reported Bihar flood information — affected districts, the general September 2026 flood
          situation along the Ganga, Kosi, Bagmati, and Gandak river systems, and the agencies involved in
          response — is used for scenario context. Where a statistic on this platform is traceable to a
          public report, it is marked <strong>Verified Public Information</strong> with a source reference.
        </p>
        <div className="detail-resource-tags" style={{ marginTop: 12 }}>
          {SOURCES.map((s) => <span key={s} className="badge badge-neutral">{s}</span>)}
        </div>
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title"><FlaskConical /> Simulated Response Data</p>
        <p style={{ fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.7 }}>
          Operational response records shown in this prototype — incident details, team dispatch status,
          medical unit and relief camp status, resource pools, community kitchen supply levels, and routing —
          are <strong>simulated for demonstration purposes</strong>. They illustrate how an adaptive coordination
          platform would function during a real flood response, but they are not live government data and do not
          represent real-time reporting from any agency. These values are marked <strong>Response Simulation</strong> or{' '}
          <strong>Simulated Response Data</strong> throughout the platform.
        </p>
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title">Why this distinction matters</p>
        <p style={{ fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.7 }}>
          This platform is built as a hackathon demonstration of adaptive, multi-agent disaster-response
          coordination. To avoid presenting fabricated operational numbers as if they were official reporting,
          every dashboard, table, and map marker distinguishes verified public context from simulated
          operational figures.
        </p>
      </div>
    </div>
  )
}

import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const SOURCES = [
  'Government of Bihar',
  'Bihar Disaster Management Department',
  'Bihar State Disaster Management Authority',
  'Bihar Water Resources Department',
]

const REPORTED_FACTS = [
  { fact: '202 deaths reported across 18 districts; ~1.21 crore (12.1 million) people affected. Worst-hit by district death toll: Araria (42), Sitamarhi (31), West Champaran (29).', source: 'Deccan Herald / PTI, September 2026' },
  { fact: 'Ganga crossed its all-time Highest Flood Level at Gandhi Ghat, Patna, and remained above danger mark at Sultanganj (Bhagalpur); Kosi, Gandak, Burhi Gandak, Bagmati, Punpun, and Ghaghra also ran above danger mark.', source: 'Sunday Guardian, September 2026' },
  { fact: 'NH104 near Sitamarhi and NH31 near Kishanganj reported submerged, cutting road access through those districts.', source: 'The Express Tribune, September 2026' },
  { fact: 'Railway stations at Kishanganj, Katihar, and Jogbani (Araria) flooded, stranding passengers; around 18 trains cancelled.', source: 'The Express Tribune, September 2026' },
  { fact: '1,336 relief camps set up statewide, sheltering approximately 4.22 lakh people.', source: 'India TV News, September 2026' },
  { fact: '10 NDRF and 27 SDRF teams deployed with 1,922 boats; 1,194 community kitchens operating.', source: 'Sunday Guardian, September 2026' },
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
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>Reported Impact (September 2026)</h2>
          <p style={{ marginBottom: 12 }}>
            The district list, rivers, and the figures below reflect news reporting on the actual flood, gathered
            via web search. This platform has no live feed into government reporting systems — treat these as a
            snapshot from mid-to-late September 2026, not a live counter.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {REPORTED_FACTS.map((f) => (
              <div key={f.fact} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <p style={{ color: 'var(--ink-700)' }}>{f.fact}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-400)' }}>Source: {f.source}</p>
              </div>
            ))}
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

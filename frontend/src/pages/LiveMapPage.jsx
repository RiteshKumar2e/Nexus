import { Map as MapIcon } from 'lucide-react'
import { useLiveOperationalData } from '../hooks/useLiveOperationalData.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import DisasterMap from '../features/map/DisasterMap.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import '../styles/LiveMapPage.css'

const LEGEND = [
  { color: 'var(--critical-500)', label: 'Critical incident' },
  { color: 'var(--warning-500)', label: 'High-risk incident' },
  { color: 'var(--brand-500)', label: 'Response team' },
  { color: '#7B5CC7', label: 'Hospital' },
  { color: 'var(--success-500)', label: 'Shelter' },
  { color: 'var(--ink-400)', label: 'Blocked road' },
]

export default function LiveMapPage() {
  useDocumentTitle('Live Map')
  const { incidents, teams, hospitals, shelters, roads, loading, error, reload } = useLiveOperationalData()

  return (
    <div className="page livemap-page">
      <div className="livemap-header">
        <h1 className="page-title">
          <MapIcon /> Live Disaster Map
        </h1>
        <div className="livemap-legend">
          {LEGEND.map((l) => (
            <div key={l.label} className="livemap-legend-item">
              <span className="livemap-legend-dot" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      <div className="card livemap-body">
        {loading ? (
          <LoadingState label="Loading live map data..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : (
          <DisasterMap incidents={incidents} teams={teams} hospitals={hospitals} shelters={shelters} roads={roads} />
        )}
      </div>
    </div>
  )
}

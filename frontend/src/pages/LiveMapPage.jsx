import { useEffect, useState } from 'react'
import { Map as MapIcon } from 'lucide-react'
import { useLiveOperationalData } from '../hooks/useLiveOperationalData.js'
import { getCommunityKitchens } from '../services/communityKitchens.js'
import { getDistricts } from '../services/districts.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import DisasterMap from '../features/map/DisasterMap.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import '../styles/LiveMapPage.css'

const LEGEND = [
  { color: 'var(--critical-500)', label: 'Critical incident / risk' },
  { color: 'var(--warning-500)', label: 'High-risk incident / district' },
  { color: '#C9A227', label: 'Monitoring district' },
  { color: 'var(--brand-500)', label: 'Response team' },
  { color: 'var(--info-500)', label: 'Medical unit' },
  { color: 'var(--success-500)', label: 'Relief camp' },
  { color: 'var(--brand-700)', label: 'Community kitchen' },
  { color: 'var(--ink-400)', label: 'Blocked road' },
]

export default function LiveMapPage() {
  useDocumentTitle('Live Map')
  const { incidents, teams, medicalUnits, reliefCamps, roads, loading, error, reload } = useLiveOperationalData()
  const [communityKitchens, setCommunityKitchens] = useState([])
  const [districts, setDistricts] = useState([])

  useEffect(() => {
    getCommunityKitchens().then(({ items }) => setCommunityKitchens(items)).catch(() => {})
    getDistricts().then(({ items }) => setDistricts(items)).catch(() => {})
  }, [])

  return (
    <div className="page livemap-page">
      <div className="livemap-header">
        <h1 className="page-title">
          <MapIcon /> Bihar Flood Response — Live Map
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
          <DisasterMap
            incidents={incidents}
            teams={teams}
            medicalUnits={medicalUnits}
            reliefCamps={reliefCamps}
            communityKitchens={communityKitchens}
            districts={districts}
            roads={roads}
          />
        )}
      </div>
    </div>
  )
}

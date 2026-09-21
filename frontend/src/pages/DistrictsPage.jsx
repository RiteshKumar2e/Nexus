import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MapPinned } from 'lucide-react'
import { getDistricts } from '../services/districts.js'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/ResourceStatCards.css'

export default function DistrictsPage() {
  useDocumentTitle('Districts')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await getDistricts()
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load districts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <LoadingState label="Loading districts..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title"><MapPinned /> Flood-Affected Districts</h1>
          <p className="page-subtext">Bihar Flood 2026 &middot; {items.length} districts tracked</p>
        </div>
      </div>

      <div className="card-grid card-grid-2 card-grid-3">
        {items.map((d) => (
          <Link key={d._id} to={`/districts/${d.id}`} className={`card entity-card ${d.riskLevel === 'CRITICAL' ? 'card-ring-critical' : ''}`} style={{ display: 'block' }}>
            <div className="entity-card-header">
              <p className="entity-card-title">{d.name}</p>
              <StatusBadge status={d.riskLevel} />
            </div>
            <p className="stat-card-category">River: {d.river}</p>
            <p className="stat-card-pct" style={{ marginTop: 8 }}>{d.affectedArea}</p>
            <div style={{ marginTop: 10 }}>
              <StatusBadge status={d.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

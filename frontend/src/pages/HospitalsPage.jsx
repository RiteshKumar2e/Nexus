import { useState, useEffect, useCallback } from 'react'
import { Building2 } from 'lucide-react'
import { getHospitals } from '../services/hospitals.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { getZoneName } from '../data/zones.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/ResourceStatCards.css'

const BAR_TONE = { NORMAL: 'progress-fill-success', WARNING: 'progress-fill-warning', CRITICAL: 'progress-fill-critical' }

export default function HospitalsPage() {
  useDocumentTitle('Hospitals')
  const { socket } = useSocket()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await getHospitals()
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hospitals.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    socket.on('hospital:updated', refresh)
    return () => socket.off('hospital:updated', refresh)
  }, [socket, load])

  if (loading) return <LoadingState label="Loading hospitals..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page">
      <h1 className="page-title"><Building2 /> Hospitals</h1>

      <div className="card-grid card-grid-2 card-grid-3">
        {items.map((h) => (
          <div key={h._id} className={`card entity-card ${h.status === 'CRITICAL' ? 'card-ring-critical' : ''}`}>
            <div className="entity-card-header">
              <p className="entity-card-title">{h.name}</p>
              <StatusBadge status={h.status} />
            </div>
            <p className="stat-card-category">{getZoneName(h.location)}</p>

            <div className="progress-track stat-card-progress">
              <div className={`progress-fill ${BAR_TONE[h.status]}`} style={{ width: `${h.currentLoadPct}%` }} />
            </div>
            <p className="stat-card-pct">{h.currentLoadPct}% capacity</p>

            <div className="stat-card-trio">
              <div><p className="stat-card-quad-value">{h.availableBeds}/{h.totalBeds}</p><p className="stat-card-quad-label">Beds</p></div>
              <div><p className="stat-card-quad-value">{h.icuAvailable}/{h.icuBeds}</p><p className="stat-card-quad-label">ICU</p></div>
              <div><p className="stat-card-quad-value">{h.ambulanceEtaMin}m</p><p className="stat-card-quad-label">Ambulance ETA</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

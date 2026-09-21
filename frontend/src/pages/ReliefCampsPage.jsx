import { useState, useEffect, useCallback } from 'react'
import { Home } from 'lucide-react'
import { getReliefCamps } from '../services/reliefCamps.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { getZoneName } from '../data/zones.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/ResourceStatCards.css'

const FACILITY_LABELS = { FOOD: 'Food', DRINKING_WATER: 'Drinking Water', MEDICAL_ASSISTANCE: 'Medical Assistance', TEMPORARY_SHELTER: 'Temporary Shelter' }

export default function ReliefCampsPage() {
  useDocumentTitle('Relief Camps')
  const { socket } = useSocket()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await getReliefCamps()
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load relief camps.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    socket.on('reliefCamp:updated', refresh)
    return () => socket.off('reliefCamp:updated', refresh)
  }, [socket, load])

  if (loading) return <LoadingState label="Loading relief camps..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title"><Home /> Relief Camps</h1>
          <p className="page-subtext">Operational Simulation &middot; capacity and facility status for the response simulation.</p>
        </div>
      </div>

      <div className="card-grid card-grid-2 card-grid-3">
        {items.map((c) => (
          <div key={c._id} className={`card entity-card ${c.capacityStatus === 'FULL' ? 'card-ring-critical' : ''}`}>
            <div className="entity-card-header">
              <p className="entity-card-title">{c.name}</p>
              <StatusBadge status={c.capacityStatus} />
            </div>
            <p className="stat-card-category">{getZoneName(c.district)} &middot; {c.location}</p>
            <div className="detail-resource-tags" style={{ marginTop: 8 }}>
              {(c.facilities || []).map((f) => (
                <span key={f} className="badge badge-neutral">{FACILITY_LABELS[f] || f}</span>
              ))}
            </div>
            <p className="stat-card-pct">Camp status: {c.status.replace(/_/g, ' ')} &middot; Accessibility: {c.accessibility.replace(/_/g, ' ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { Package } from 'lucide-react'
import { getResources } from '../services/resources.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { getZoneName } from '../data/zones.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/ResourceStatCards.css'

export default function ResourcesPage() {
  useDocumentTitle('Resources')
  const { socket } = useSocket()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await getResources()
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resources.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    socket.on('resource:updated', refresh)
    return () => socket.off('resource:updated', refresh)
  }, [socket, load])

  if (loading) return <LoadingState label="Loading resources..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title"><Package /> Rescue Resources</h1>
          <p className="page-subtext">Operational Simulation &middot; status reflects the response simulation, not live inventory feeds.</p>
        </div>
      </div>

      <div className="card-grid card-grid-2 card-grid-3">
        {items.map((r) => (
          <div key={r._id} className={`card entity-card ${r.status === 'CRITICAL_SHORTAGE' ? 'card-ring-critical' : ''}`}>
            <div className="entity-card-header">
              <p className="entity-card-title">{r.name}</p>
              <StatusBadge status={r.status} />
            </div>
            <p className="stat-card-category">{r.category.replace(/_/g, ' ')} &middot; {r.region ? getZoneName(r.region) : 'State reserve'}</p>
            {r.purpose && <p className="stat-card-pct" style={{ marginTop: 6 }}>{r.purpose}</p>}
            <p style={{ fontSize: 11, color: 'var(--ink-400)', marginTop: 10 }}>
              {r.available.toLocaleString('en-IN')} / {r.total.toLocaleString('en-IN')} {r.unit} available &middot; simulated units
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { Package } from 'lucide-react'
import { getResources } from '../services/resources.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { pct } from '../utils/format.js'
import '../styles/ResourceStatCards.css'

const BAR_TONE = { HEALTHY: 'progress-fill-success', LOW: 'progress-fill-warning', CRITICAL: 'progress-fill-critical' }

export default function ResourcesPage() {
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
      <h1 className="page-title"><Package /> Resources</h1>

      <div className="card-grid card-grid-2 card-grid-3">
        {items.map((r) => (
          <div key={r._id} className="card entity-card">
            <div className="entity-card-header">
              <p className="entity-card-title">{r.name}</p>
              <StatusBadge status={r.status} />
            </div>
            <p className="stat-card-category">{r.category.replace(/_/g, ' ')}</p>
            <div className="progress-track stat-card-progress">
              <div className={`progress-fill ${BAR_TONE[r.status]}`} style={{ width: `${pct(r.available, r.total)}%` }} />
            </div>
            <div className="stat-card-quad">
              <div><p className="stat-card-quad-value">{r.available}</p><p className="stat-card-quad-label">Available</p></div>
              <div><p className="stat-card-quad-value">{r.allocated}</p><p className="stat-card-quad-label">Allocated</p></div>
              <div><p className="stat-card-quad-value">{r.consumed}</p><p className="stat-card-quad-label">Consumed</p></div>
              <div><p className="stat-card-quad-value">{r.total}</p><p className="stat-card-quad-label">Total</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

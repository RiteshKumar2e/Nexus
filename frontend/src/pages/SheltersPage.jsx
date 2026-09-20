import { useState, useEffect, useCallback } from 'react'
import { Home } from 'lucide-react'
import { getShelters } from '../services/shelters.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { getZoneName } from '../data/zones.js'
import { pct } from '../utils/format.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/ResourceStatCards.css'

const BAR_TONE = { AVAILABLE: 'progress-fill-success', NEAR_CAPACITY: 'progress-fill-warning', FULL: 'progress-fill-critical' }

export default function SheltersPage() {
  useDocumentTitle('Shelters')
  const { socket } = useSocket()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await getShelters()
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load shelters.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    socket.on('shelter:updated', refresh)
    return () => socket.off('shelter:updated', refresh)
  }, [socket, load])

  if (loading) return <LoadingState label="Loading shelters..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page">
      <h1 className="page-title"><Home /> Shelters</h1>

      <div className="card-grid card-grid-2 card-grid-3">
        {items.map((s) => (
          <div key={s._id} className={`card entity-card ${s.status === 'FULL' ? 'card-ring-critical' : ''}`}>
            <div className="entity-card-header">
              <p className="entity-card-title">{s.name}</p>
              <StatusBadge status={s.status} />
            </div>
            <p className="stat-card-category">{getZoneName(s.location)}</p>
            <div className="progress-track stat-card-progress">
              <div className={`progress-fill ${BAR_TONE[s.status]}`} style={{ width: `${pct(s.occupied, s.capacity)}%` }} />
            </div>
            <p className="stat-card-pct">{s.occupied} / {s.capacity} occupied</p>
          </div>
        ))}
      </div>
    </div>
  )
}

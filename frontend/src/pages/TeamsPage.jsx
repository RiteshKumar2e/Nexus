import { useState, useEffect, useCallback } from 'react'
import { Users, MapPin, Package } from 'lucide-react'
import { getTeams } from '../services/teams.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getZoneName } from '../data/zones.js'
import '../styles/TeamsPage.css'

const FILTERS = ['ALL', 'AVAILABLE', 'BUSY', 'EN_ROUTE', 'UNAVAILABLE']

export default function TeamsPage() {
  const { socket } = useSocket()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('ALL')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await getTeams(filter === 'ALL' ? {} : { status: filter })
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load teams.')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    socket.on('team:updated', refresh)
    return () => socket.off('team:updated', refresh)
  }, [socket, load])

  return (
    <div className="page">
      <div className="page-header-row">
        <h1 className="page-title"><Users /> Response Teams</h1>
        <div className="teams-filters">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`filter-pill ${filter === f ? 'is-active' : ''}`}>
              {f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading teams..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState icon={Users} title="No teams match this filter" />
      ) : (
        <div className="card-grid card-grid-2 card-grid-3">
          {items.map((team) => (
            <div key={team._id} className="card entity-card">
              <div className="entity-card-header">
                <p className="entity-card-title">{team.name}</p>
                <StatusBadge status={team.status} />
              </div>
              <p className="team-card-type">{team.type}</p>
              <div className="team-card-meta">
                <p className="team-card-meta-row"><MapPin /> {getZoneName(team.currentAssignment?.zone || team.location)}</p>
                {team.currentAssignment?.eta != null && <p className="team-card-eta">ETA: {team.currentAssignment.eta} min</p>}
                <p className="team-card-meta-row team-card-resources">
                  <Package />
                  <span className="team-card-resource-tags">
                    {team.resources.map((r) => <span key={r} className="badge badge-neutral">{r}</span>)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

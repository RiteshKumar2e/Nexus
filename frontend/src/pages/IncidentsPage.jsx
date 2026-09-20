import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Siren } from 'lucide-react'
import { getIncidents } from '../services/incidents.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { timeAgo } from '../utils/format.js'
import { getZoneName } from '../data/zones.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/IncidentsPage.css'

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const STATUSES = ['ACTIVE', 'MONITORING', 'RESOLVED']
const TYPES = ['FLOOD', 'BUILDING_COLLAPSE', 'FIRE', 'MEDICAL_EMERGENCY', 'ROAD_ACCIDENT', 'WATER_RESCUE', 'INFRASTRUCTURE']

export default function IncidentsPage() {
  useDocumentTitle('Incidents')
  const { socket } = useSocket()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ search: '', severity: '', status: '', type: '' })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      Object.entries(filters).forEach(([k, v]) => v && (params[k] = v))
      const { items } = await getIncidents({ ...params, limit: 50 })
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load incidents.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    socket.on('incident:created', refresh)
    socket.on('incident:updated', refresh)
    return () => {
      socket.off('incident:created', refresh)
      socket.off('incident:updated', refresh)
    }
  }, [socket, load])

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title"><Siren /> Incidents</h1>
          <p className="page-subtext">{items.length} showing</p>
        </div>
      </div>

      <div className="card filter-bar">
        <div className="filter-search">
          <Search />
          <input
            className="input"
            placeholder="Search incidents..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
        <select className="input filter-select" value={filters.severity} onChange={(e) => setFilters((f) => ({ ...f, severity: e.target.value }))}>
          <option value="">All severities</option>
          {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input filter-select" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input filter-select" value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
          <option value="">All types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <LoadingState label="Loading incidents..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : items.length === 0 ? (
          <EmptyState icon={Siren} title="No incidents match your filters" />
        ) : (
          <>
            <div className="incidents-table-head">
              <span>ID</span><span>Type</span><span>Severity</span><span>Location</span><span>Status</span><span>Assigned Team</span><span>Updated</span>
            </div>
            <div className="incidents-table-body">
              {items.map((inc) => (
                <Link key={inc._id} to={`/incidents/${inc._id}`} className="incidents-row">
                  <span className="incidents-row-id">{inc.incidentId}</span>
                  <span className="incidents-row-type">{inc.type.replace(/_/g, ' ')}</span>
                  <span><StatusBadge status={inc.severity} /></span>
                  <span className="incidents-row-location">{getZoneName(inc.zone)}</span>
                  <span><StatusBadge status={inc.status} /></span>
                  <span className="incidents-row-team">{inc.assignedTeam?.name || 'Unassigned'}</span>
                  <span className="incidents-row-updated">{timeAgo(inc.updatedAt)}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

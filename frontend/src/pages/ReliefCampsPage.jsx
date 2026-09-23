import { useState, useEffect, useCallback } from 'react'
import { Home, MapPin } from 'lucide-react'
import { getReliefCamps } from '../services/reliefCamps.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import OpsPageHeader from '../components/OpsPageHeader.jsx'
import SummaryStrip from '../components/SummaryStrip.jsx'
import OpsToolbar from '../components/OpsToolbar.jsx'
import { getZoneName } from '../data/zones.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const FACILITY_LABELS = { FOOD: 'Food', DRINKING_WATER: 'Drinking water', MEDICAL_ASSISTANCE: 'Medical aid', TEMPORARY_SHELTER: 'Shelter' }

const CAPACITY_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'FULL', label: 'Full' },
  { value: 'NEAR_CAPACITY', label: 'Near capacity' },
  { value: 'AVAILABLE', label: 'Has space' },
]

function toneFor(c) {
  if (c.capacityStatus === 'FULL') return 'critical'
  if (c.capacityStatus === 'NEAR_CAPACITY') return 'warning'
  return 'ok'
}

const humanize = (v) => String(v || '').replace(/_/g, ' ').toLowerCase()

export default function ReliefCampsPage() {
  useDocumentTitle('Relief Camps')
  const { socket } = useSocket()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('ALL')

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

  const q = query.trim().toLowerCase()
  const visible = items.filter((c) => {
    if (filter !== 'ALL' && c.capacityStatus !== filter) return false
    if (!q) return true
    return [c.name, c.location, getZoneName(c.district)].some((v) => v?.toLowerCase().includes(q))
  })
  const count = (fn) => items.filter(fn).length

  return (
    <div className="page">
      <OpsPageHeader
        icon={Home}
        title="Relief Camps"
        subtitle="Shelter capacity, facilities, and access for evacuees across affected districts."
      />

      <SummaryStrip
        items={[
          { label: 'Relief camps', value: items.length },
          { label: 'Full', value: count((c) => c.capacityStatus === 'FULL'), tone: 'critical' },
          { label: 'Near capacity', value: count((c) => c.capacityStatus === 'NEAR_CAPACITY'), tone: 'warning' },
          { label: 'Has space', value: count((c) => c.capacityStatus === 'AVAILABLE'), tone: 'success' },
        ]}
      />

      <OpsToolbar
        query={query}
        onQuery={setQuery}
        placeholder="Search camp, district, location..."
        filters={CAPACITY_FILTERS.map((f) => ({ ...f, count: f.value === 'ALL' ? items.length : count((c) => c.capacityStatus === f.value) }))}
        active={filter}
        onFilter={setFilter}
      />

      {visible.length === 0 ? (
        <div className="ops-empty">No relief camps match this filter.</div>
      ) : (
        <div className="ops-grid">
          {visible.map((c) => (
            <article key={c._id} className="ops-card" data-tone={toneFor(c)}>
              <header className="ops-card-head">
                <div style={{ minWidth: 0 }}>
                  <h3 className="ops-card-title">{c.name}</h3>
                  <p className="ops-card-meta"><MapPin /> {getZoneName(c.district)} · {c.location}</p>
                </div>
                <StatusBadge status={c.capacityStatus} />
              </header>
              <dl className="ops-kv">
                <div><dt>Camp status</dt><dd><StatusBadge status={c.status} /></dd></div>
                <div><dt>Access</dt><dd><StatusBadge status={c.accessibility} /></dd></div>
              </dl>
              {c.facilities?.length > 0 && (
                <div className="ops-chips">
                  {c.facilities.map((f) => (
                    <span key={f} className="ops-chip">{FACILITY_LABELS[f] || humanize(f)}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

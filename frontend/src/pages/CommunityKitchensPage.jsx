import { useState, useEffect, useCallback } from 'react'
import { CookingPot, MapPin } from 'lucide-react'
import { getCommunityKitchens } from '../services/communityKitchens.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import OpsPageHeader from '../components/OpsPageHeader.jsx'
import SummaryStrip from '../components/SummaryStrip.jsx'
import OpsToolbar from '../components/OpsToolbar.jsx'
import { getZoneName } from '../data/zones.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const SUPPLY_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'CRITICAL_SHORTAGE', label: 'Critical shortage' },
  { value: 'LIMITED', label: 'Limited' },
  { value: 'AVAILABLE', label: 'Available' },
]

function toneFor(k) {
  if (k.foodSupplyStatus === 'CRITICAL_SHORTAGE') return 'critical'
  if (k.foodSupplyStatus === 'LIMITED' || k.status === 'SETTING_UP') return 'warning'
  return 'ok'
}

export default function CommunityKitchensPage() {
  useDocumentTitle('Community Kitchens')
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
      const { items } = await getCommunityKitchens()
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load community kitchens.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    socket.on('communityKitchen:updated', refresh)
    return () => socket.off('communityKitchen:updated', refresh)
  }, [socket, load])

  if (loading) return <LoadingState label="Loading community kitchens..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  const q = query.trim().toLowerCase()
  const visible = items.filter((k) => {
    if (filter !== 'ALL' && k.foodSupplyStatus !== filter) return false
    if (!q) return true
    return [k.name, k.location, getZoneName(k.district)].some((v) => v?.toLowerCase().includes(q))
  })
  const count = (fn) => items.filter(fn).length

  return (
    <div className="page">
      <OpsPageHeader
        icon={CookingPot}
        title="Community Kitchens"
        subtitle="Food supply and distribution status for every kitchen serving flood-affected districts."
      />

      <SummaryStrip
        items={[
          { label: 'Kitchens', value: items.length },
          { label: 'Serving now', value: count((k) => k.distributionStatus === 'ONGOING'), tone: 'success' },
          { label: 'Critical shortage', value: count((k) => k.foodSupplyStatus === 'CRITICAL_SHORTAGE'), tone: 'critical' },
          { label: 'Setting up', value: count((k) => k.status === 'SETTING_UP'), tone: 'warning' },
        ]}
      />

      <OpsToolbar
        query={query}
        onQuery={setQuery}
        placeholder="Search kitchen, district, location..."
        filters={SUPPLY_FILTERS.map((f) => ({ ...f, count: f.value === 'ALL' ? items.length : count((k) => k.foodSupplyStatus === f.value) }))}
        active={filter}
        onFilter={setFilter}
      />

      {visible.length === 0 ? (
        <div className="ops-empty">No kitchens match this filter.</div>
      ) : (
        <div className="ops-grid">
          {visible.map((k) => (
            <article key={k._id} className="ops-card" data-tone={toneFor(k)}>
              <header className="ops-card-head">
                <div style={{ minWidth: 0 }}>
                  <h3 className="ops-card-title">{k.name}</h3>
                  <p className="ops-card-meta"><MapPin /> {getZoneName(k.district)} · {k.location}</p>
                </div>
                <StatusBadge status={k.status} />
              </header>
              <dl className="ops-kv">
                <div><dt>Food supply</dt><dd><StatusBadge status={k.foodSupplyStatus} /></dd></div>
                <div><dt>Distribution</dt><dd><StatusBadge status={k.distributionStatus} /></dd></div>
                <div><dt>Priority</dt><dd><StatusBadge status={k.priority} /></dd></div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { Stethoscope, MapPin } from 'lucide-react'
import { getMedicalUnits } from '../services/medicalUnits.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import OpsPageHeader from '../components/OpsPageHeader.jsx'
import SummaryStrip from '../components/SummaryStrip.jsx'
import OpsToolbar from '../components/OpsToolbar.jsx'
import { getZoneName } from '../data/zones.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH_DEMAND', label: 'High demand' },
  { value: 'LIMITED', label: 'Limited' },
  { value: 'AVAILABLE', label: 'Available' },
]

function toneFor(m) {
  if (m.status === 'CRITICAL') return 'critical'
  if (m.status === 'HIGH_DEMAND' || m.status === 'LIMITED') return 'warning'
  return 'ok'
}

const humanize = (v) => String(v || '').replace(/_/g, ' ').toLowerCase()

export default function MedicalUnitsPage() {
  useDocumentTitle('Medical Response')
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
      const { items } = await getMedicalUnits()
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load medical units.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    socket.on('medicalUnit:updated', refresh)
    return () => socket.off('medicalUnit:updated', refresh)
  }, [socket, load])

  if (loading) return <LoadingState label="Loading medical response data..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  const q = query.trim().toLowerCase()
  const visible = items.filter((m) => {
    if (filter !== 'ALL' && m.status !== filter) return false
    if (!q) return true
    return [m.name, getZoneName(m.district), m.facilityType].some((v) => v?.toLowerCase().includes(q))
  })
  const count = (fn) => items.filter(fn).length

  return (
    <div className="page">
      <OpsPageHeader
        icon={Stethoscope}
        title="Medical Response"
        subtitle="Hospitals, medical camps, and ambulance posts — staffing, transport, and supply status."
      />

      <SummaryStrip
        items={[
          { label: 'Medical units', value: items.length },
          { label: 'Critical', value: count((m) => m.status === 'CRITICAL'), tone: 'critical' },
          { label: 'High demand', value: count((m) => m.status === 'HIGH_DEMAND'), tone: 'warning' },
          { label: 'Accepting patients', value: count((m) => m.status === 'AVAILABLE'), tone: 'success' },
        ]}
      />

      <OpsToolbar
        query={query}
        onQuery={setQuery}
        placeholder="Search unit, district, facility type..."
        filters={STATUS_FILTERS.map((f) => ({ ...f, count: f.value === 'ALL' ? items.length : count((m) => m.status === f.value) }))}
        active={filter}
        onFilter={setFilter}
      />

      {visible.length === 0 ? (
        <div className="ops-empty">No medical units match this filter.</div>
      ) : (
        <div className="ops-grid">
          {visible.map((m) => (
            <article key={m._id} className="ops-card" data-tone={toneFor(m)}>
              <header className="ops-card-head">
                <div style={{ minWidth: 0 }}>
                  <h3 className="ops-card-title">{m.name}</h3>
                  <p className="ops-card-meta">
                    <MapPin /> {getZoneName(m.district)} · <span style={{ textTransform: 'capitalize' }}>{humanize(m.facilityType)}</span>
                  </p>
                </div>
                <StatusBadge status={m.status} />
              </header>
              <dl className="ops-kv">
                <div><dt>Doctors</dt><dd><StatusBadge status={m.doctorsStatus} /></dd></div>
                <div><dt>Ambulances</dt><dd><StatusBadge status={m.ambulanceStatus} /></dd></div>
                <div><dt>Medicine</dt><dd><StatusBadge status={m.medicineStatus} /></dd></div>
                <div><dt>Priority cases</dt><dd><StatusBadge status={m.priorityCases} /></dd></div>
              </dl>
              <footer className="ops-card-foot">
                Access: <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--ink-700)' }}>{humanize(m.accessibility)}</span>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

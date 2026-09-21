import { useState, useEffect, useCallback } from 'react'
import { Bell, ShieldCheck, FlaskConical } from 'lucide-react'
import { getAlerts } from '../services/alerts.js'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getZoneName } from '../data/zones.js'
import { timeAgo } from '../utils/format.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function AlertsPage() {
  useDocumentTitle('Alerts')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await getAlerts()
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load alerts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <LoadingState label="Loading alerts..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title"><Bell /> Alerts</h1>
          <p className="page-subtext">Emergency alert panel for the Bihar Flood 2026 response.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Bell} title="No alerts recorded" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((a) => (
            <div key={a._id} className={`card ${a.severity === 'CRITICAL' ? 'card-ring-critical' : ''}`} style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</p>
                <StatusBadge status={a.severity} />
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 8 }}>{a.message}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--ink-400)' }}>
                {a.district && <span>{getZoneName(a.district)} &middot;</span>}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {a.sourceType === 'VERIFIED' ? <ShieldCheck style={{ width: 12, height: 12 }} /> : <FlaskConical style={{ width: 12, height: 12 }} />}
                  {a.sourceType === 'VERIFIED' ? 'Verified Public Information' : 'Simulated Response Data'} &middot; {a.source}
                </span>
                <span>&middot; {timeAgo(a.issuedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

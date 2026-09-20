import { useState, useEffect, useCallback } from 'react'
import { Search, ScrollText } from 'lucide-react'
import { getDecisionLog } from '../services/decisionLog.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatTime, timeAgo } from '../utils/format.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/DecisionLogPage.css'

export default function DecisionLogPage() {
  useDocumentTitle('Decision Log')
  const { socket } = useSocket()
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await getDecisionLog(search ? { search } : {})
      setItems(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load decision log.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    socket.on('decision:created', refresh)
    socket.on('decision:explained', refresh)
    return () => {
      socket.off('decision:created', refresh)
      socket.off('decision:explained', refresh)
    }
  }, [socket, load])

  return (
    <div className="page page-max-4xl">
      <h1 className="page-title"><ScrollText /> Decision Log</h1>

      <div className="filter-search">
        <Search />
        <input className="input" placeholder="Search decisions..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <LoadingState label="Loading decision log..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState icon={ScrollText} title="No decisions recorded yet" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((d) => (
            <div key={d._id} className="card decision-card">
              <div className="decision-card-header">
                <p className="decision-card-number">DECISION #{d.decisionNumber}</p>
                <StatusBadge status={d.status} />
              </div>
              <div className="decision-grid">
                <div><p className="section-label" style={{ marginBottom: 4 }}>Trigger</p><p className="decision-field-title">{d.trigger}</p></div>
                <div><p className="section-label" style={{ marginBottom: 4 }}>Agents</p><div className="decision-agents">{d.agents.map((a) => <span key={a} className="badge badge-brand">{a}</span>)}</div></div>
                <div className="decision-grid-full"><p className="section-label" style={{ marginBottom: 4 }}>Decision</p><p className="decision-field-title">{d.decision}</p></div>
                <div className="decision-grid-full"><p className="section-label" style={{ marginBottom: 4 }}>Reason</p><p className="decision-field-text">{d.reason}</p></div>
                {d.result && <div className="decision-grid-full"><p className="section-label" style={{ marginBottom: 4 }}>Result</p><p className="decision-field-text">{d.result}</p></div>}
                {d.aiExplanation && (
                  <div className="decision-grid-full decision-explanation">
                    <p className="decision-explanation-label">AI Explanation</p>
                    <p className="decision-explanation-text">{d.aiExplanation}</p>
                  </div>
                )}
              </div>
              <p className="decision-timestamp">{formatTime(d.createdAt)} &middot; {timeAgo(d.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

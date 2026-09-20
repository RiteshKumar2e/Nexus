import { useEffect, useState } from 'react'
import { Radio } from 'lucide-react'
import { useSocket } from '../../context/SocketContext.jsx'
import { formatTime } from '../../utils/format.js'
import EmptyState from '../../components/EmptyState.jsx'
import '../../styles/EventStream.css'

const TONE = {
  'road:blocked': 'critical',
  'plan:invalidated': 'neutral',
  'plan:created': 'brand',
  'plan:activated': 'success',
  'plan:approved': 'success',
  'plan:rejected': 'critical',
  'team:updated': 'brand',
  'hospital:updated': 'warning',
  'shelter:updated': 'warning',
  'incident:created': 'critical',
  'decision:created': 'neutral',
  'alert:created': 'warning',
  'road:updated': 'warning',
}

function labelFor(event, payload) {
  switch (event) {
    case 'road:blocked':
      return `ROAD BLOCKED — ${payload.road?.roadId}`
    case 'road:updated':
      return `ROAD UPDATED — ${payload.road?.roadId} (${payload.road?.status})`
    case 'plan:invalidated':
      return `PLAN CONFLICT DETECTED — #${payload.planNumber}`
    case 'plan:created':
      return `ALTERNATIVE PLAN GENERATED — #${payload.plan?.planNumber}`
    case 'plan:activated':
      return `PLAN #${payload.planNumber} ACTIVATED`
    case 'plan:approved':
      return `PLAN #${payload.planNumber} APPROVED`
    case 'plan:rejected':
      return `PLAN #${payload.planNumber} REJECTED`
    case 'team:updated':
      return `${payload.team?.name?.toUpperCase()} — ${payload.team?.status}`
    case 'hospital:updated':
      return `${payload.hospital?.name?.toUpperCase()} — ${payload.hospital?.status}`
    case 'shelter:updated':
      return `${payload.shelter?.name?.toUpperCase()} — ${payload.shelter?.status}`
    case 'incident:created':
      return `NEW INCIDENT — ${payload.incident?.incidentId}`
    case 'decision:created':
      return `DECISION #${payload.decision?.decisionNumber} LOGGED`
    case 'alert:created':
      return `ALERT — ${payload.message}`
    default:
      return event.toUpperCase()
  }
}

export default function EventStream({ maxItems = 40 }) {
  const { socket } = useSocket()
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!socket) return
    const eventNames = [
      'road:blocked',
      'road:updated',
      'plan:invalidated',
      'plan:created',
      'plan:activated',
      'plan:approved',
      'plan:rejected',
      'team:updated',
      'hospital:updated',
      'shelter:updated',
      'incident:created',
      'decision:created',
      'alert:created',
    ]

    const handlers = eventNames.map((name) => {
      const handler = (payload) => {
        setEvents((prev) =>
          [{ id: `${name}-${payload.timestamp}-${Math.random()}`, event: name, payload, time: payload.timestamp || new Date().toISOString() }, ...prev].slice(0, maxItems)
        )
      }
      socket.on(name, handler)
      return { name, handler }
    })

    return () => handlers.forEach(({ name, handler }) => socket.off(name, handler))
  }, [socket, maxItems])

  return (
    <div className="card eventstream">
      <div className="eventstream-header">
        <Radio style={{ width: 16, height: 16, color: 'var(--brand-600)' }} />
        <p className="eventstream-title">Live Event Stream</p>
        <span className="status-dot animate-pulse-dot eventstream-live-dot" style={{ background: 'var(--success-500)' }} />
      </div>
      <div className="eventstream-list">
        {events.length === 0 ? (
          <EmptyState title="Monitoring for events" description="Trigger a simulation event to see live updates here." />
        ) : (
          events.map((e) => (
            <div key={e.id} className="eventstream-item animate-fade-in-up">
              <span className={`eventstream-dot eventstream-dot-${TONE[e.event] || 'neutral'}`} />
              <div style={{ minWidth: 0 }}>
                <p className="eventstream-time">{formatTime(e.time)}</p>
                <p className="eventstream-label">{labelFor(e.event, e.payload)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

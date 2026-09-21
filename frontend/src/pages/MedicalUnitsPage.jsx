import { useState, useEffect, useCallback } from 'react'
import { Stethoscope } from 'lucide-react'
import { getMedicalUnits } from '../services/medicalUnits.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { getZoneName } from '../data/zones.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/ResourceStatCards.css'

export default function MedicalUnitsPage() {
  useDocumentTitle('Medical Response')
  const { socket } = useSocket()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title"><Stethoscope /> Medical Response</h1>
          <p className="page-subtext">Operational Simulation &middot; status reflects the response simulation, not live hospital records.</p>
        </div>
      </div>

      <div className="card-grid card-grid-2 card-grid-3">
        {items.map((m) => (
          <div key={m._id} className={`card entity-card ${m.status === 'CRITICAL' ? 'card-ring-critical' : ''}`}>
            <div className="entity-card-header">
              <p className="entity-card-title">{m.name}</p>
              <StatusBadge status={m.status} />
            </div>
            <p className="stat-card-category">{getZoneName(m.district)} &middot; {m.facilityType.replace(/_/g, ' ')}</p>

            <div className="stat-card-trio">
              <div><p className="stat-card-quad-value" style={{ fontSize: 13 }}><StatusBadge status={m.doctorsStatus} /></p><p className="stat-card-quad-label">Doctors</p></div>
              <div><p className="stat-card-quad-value" style={{ fontSize: 13 }}><StatusBadge status={m.ambulanceStatus} /></p><p className="stat-card-quad-label">Ambulances</p></div>
              <div><p className="stat-card-quad-value" style={{ fontSize: 13 }}><StatusBadge status={m.medicineStatus} /></p><p className="stat-card-quad-label">Medicine</p></div>
            </div>
            <p className="stat-card-pct">Priority cases: {m.priorityCases} &middot; Accessibility: {m.accessibility.replace(/_/g, ' ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

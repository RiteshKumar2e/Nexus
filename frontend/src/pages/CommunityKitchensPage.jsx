import { useState, useEffect, useCallback } from 'react'
import { CookingPot } from 'lucide-react'
import { getCommunityKitchens } from '../services/communityKitchens.js'
import { useSocket } from '../context/SocketContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { getZoneName } from '../data/zones.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/ResourceStatCards.css'

export default function CommunityKitchensPage() {
  useDocumentTitle('Community Kitchens')
  const { socket } = useSocket()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title"><CookingPot /> Community Kitchens</h1>
          <p className="page-subtext">Operational Simulation &middot; food supply and distribution status by kitchen.</p>
        </div>
      </div>

      <div className="card-grid card-grid-2 card-grid-3">
        {items.map((k) => (
          <div key={k._id} className={`card entity-card ${k.foodSupplyStatus === 'CRITICAL_SHORTAGE' ? 'card-ring-critical' : ''}`}>
            <div className="entity-card-header">
              <p className="entity-card-title">{k.name}</p>
              <StatusBadge status={k.status} />
            </div>
            <p className="stat-card-category">{getZoneName(k.district)} &middot; {k.location}</p>
            <div className="stat-card-trio">
              <div><p className="stat-card-quad-value" style={{ fontSize: 13 }}><StatusBadge status={k.foodSupplyStatus} /></p><p className="stat-card-quad-label">Food Supply</p></div>
              <div><p className="stat-card-quad-value" style={{ fontSize: 13 }}><StatusBadge status={k.distributionStatus} /></p><p className="stat-card-quad-label">Distribution</p></div>
              <div><p className="stat-card-quad-value" style={{ fontSize: 13 }}><StatusBadge status={k.priority} /></p><p className="stat-card-quad-label">Priority</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Siren, TriangleAlert, Users, Building2, Home, Package, Maximize2 } from 'lucide-react'
import { getDashboardSummary } from '../services/dashboard.js'
import { useSocket } from '../context/SocketContext.jsx'
import { useLiveOperationalData } from '../hooks/useLiveOperationalData.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import MetricCard from '../features/commandCenter/MetricCard.jsx'
import EventStream from '../features/commandCenter/EventStream.jsx'
import ActivePlanCard from '../features/commandCenter/ActivePlanCard.jsx'
import CopilotPanel from '../features/copilot/CopilotPanel.jsx'
import DisasterMap from '../features/map/DisasterMap.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import '../styles/CommandCenterPage.css'

export default function CommandCenterPage() {
  useDocumentTitle('Command Center')
  const { socket } = useSocket()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { incidents, teams, hospitals, shelters, roads } = useLiveOperationalData()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setSummary(await getDashboardSummary())
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load command center summary.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    const events = ['incident:created', 'incident:updated', 'team:updated', 'hospital:updated', 'shelter:updated', 'plan:activated', 'resource:updated']
    events.forEach((e) => socket.on(e, refresh))
    return () => events.forEach((e) => socket.off(e, refresh))
  }, [socket, load])

  if (loading && !summary) return <LoadingState label="Loading command center..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page">
      <div className="cc-metrics">
        <MetricCard icon={Siren} label="Active Incidents" value={summary?.activeIncidents ?? '—'} />
        <MetricCard icon={TriangleAlert} label="Critical" value={summary?.criticalIncidents ?? '—'} tone="critical" />
        <MetricCard icon={Users} label="Teams Active" value={`${summary?.teamsActive ?? 0} / ${summary?.teamsTotal ?? 0}`} />
        <MetricCard icon={Building2} label="Hospitals" value={`${summary?.hospitalsHealthy ?? 0} / ${summary?.hospitalsTotal ?? 0}`} />
        <MetricCard icon={Home} label="Shelter Capacity" value={`${summary?.shelterCapacityPct ?? 0}%`} tone={summary?.shelterCapacityPct > 85 ? 'warning' : 'neutral'} />
        <MetricCard
          icon={Package}
          label="Resources"
          value={summary?.resourceStatus || 'HEALTHY'}
          tone={summary?.resourceStatus === 'CRITICAL' ? 'critical' : summary?.resourceStatus === 'LOW' ? 'warning' : 'success'}
        />
      </div>

      <div className="cc-main-grid">
        <div className="card cc-map-card">
          <div className="cc-map-header">
            <p className="cc-map-header-title">Live Situation Map</p>
            <Link to="/command-center/map" className="cc-map-expand">
              Expand <Maximize2 />
            </Link>
          </div>
          <div className="cc-map-body">
            <DisasterMap incidents={incidents} teams={teams} hospitals={hospitals} shelters={shelters} roads={roads} />
          </div>
        </div>
        <EventStream />
      </div>

      <div className="cc-bottom-grid">
        <ActivePlanCard />
        <CopilotPanel />
      </div>
    </div>
  )
}

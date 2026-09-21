import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Siren, TriangleAlert, Users, Stethoscope, Home, Package, CookingPot, Bell, Maximize2 } from 'lucide-react'
import { getDashboardSummary } from '../services/dashboard.js'
import { useSocket } from '../context/SocketContext.jsx'
import { useLiveOperationalData } from '../hooks/useLiveOperationalData.js'
import { getCommunityKitchens } from '../services/communityKitchens.js'
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
  const [communityKitchens, setCommunityKitchens] = useState([])
  const { incidents, teams, medicalUnits, reliefCamps, roads } = useLiveOperationalData()

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
    getCommunityKitchens().then(({ items }) => setCommunityKitchens(items)).catch(() => {})
  }, [load])

  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    const events = ['incident:created', 'incident:updated', 'team:updated', 'medicalUnit:updated', 'reliefCamp:updated', 'plan:activated', 'resource:updated']
    events.forEach((e) => socket.on(e, refresh))
    return () => events.forEach((e) => socket.off(e, refresh))
  }, [socket, load])

  if (loading && !summary) return <LoadingState label="Loading command center..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page">
      <div className="cc-banner">
        <div>
          <p className="cc-banner-eyebrow">BIHAR FLOOD RESPONSE</p>
          <h1 className="cc-banner-title">Emergency coordination dashboard for flood-affected districts</h1>
          <p className="cc-banner-sub">Response Simulation &middot; Last system update: 21 Sep 2026</p>
        </div>
      </div>

      <p className="section-label" style={{ margin: '20px 0 10px' }}>Situation Overview</p>
      <div className="cc-metrics">
        <MetricCard icon={TriangleAlert} label="Affected Districts" value={summary?.affectedDistricts ?? '—'} sub={`${summary?.criticalDistricts ?? 0} critical`} tone={summary?.criticalDistricts > 0 ? 'critical' : 'neutral'} />
        <MetricCard icon={Siren} label="Active Incidents" value={summary?.activeIncidents ?? '—'} sub={`${summary?.criticalIncidents ?? 0} critical`} tone={summary?.criticalIncidents > 0 ? 'critical' : 'neutral'} />
        <MetricCard icon={Users} label="Teams Active" value={`${summary?.teamsActive ?? 0} / ${summary?.teamsTotal ?? 0}`} />
        <MetricCard icon={Home} label="Relief Camps" value={`${summary?.activeReliefCamps ?? 0} / ${summary?.reliefCampsTotal ?? 0} active`} sub={summary?.fullReliefCamps ? `${summary.fullReliefCamps} at full capacity` : undefined} tone={summary?.fullReliefCamps > 0 ? 'warning' : 'success'} />
        <MetricCard
          icon={Stethoscope}
          label="Medical Support"
          value={(summary?.medicalStatus || 'AVAILABLE').replace(/_/g, ' ')}
          tone={summary?.medicalStatus === 'CRITICAL' ? 'critical' : summary?.medicalStatus === 'HIGH_DEMAND' ? 'warning' : 'success'}
        />
        <MetricCard icon={CookingPot} label="Community Kitchens" value={`${summary?.kitchensActive ?? 0} / ${summary?.kitchensTotal ?? 0} active`} />
        <MetricCard
          icon={Package}
          label="Rescue Resources"
          value={(summary?.resourceStatus || 'AVAILABLE').replace(/_/g, ' ')}
          tone={summary?.resourceStatus === 'CRITICAL_SHORTAGE' ? 'critical' : summary?.resourceStatus === 'MAINTENANCE' || summary?.resourceStatus === 'STANDBY' ? 'warning' : 'success'}
        />
        <MetricCard icon={Bell} label="Critical Alerts" value={summary?.criticalAlerts ?? 0} tone={summary?.criticalAlerts > 0 ? 'critical' : 'neutral'} />
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
            <DisasterMap incidents={incidents} teams={teams} medicalUnits={medicalUnits} reliefCamps={reliefCamps} communityKitchens={communityKitchens} roads={roads} />
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

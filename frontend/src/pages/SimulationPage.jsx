import { useState, useEffect, useCallback } from 'react'
import {
  FlaskConical,
  Play,
  Pause,
  RotateCcw,
  Waves,
  TriangleAlert,
  HeartPulse,
  Home,
  UserX,
  Siren,
  PackageMinus,
  Loader2,
} from 'lucide-react'
import {
  getSimulationState,
  startSimulation,
  pauseSimulation,
  resumeSimulation,
  resetSimulation,
  triggerEvent,
} from '../services/simulation.js'
import { useAuth } from '../context/AuthContext.jsx'
import EventStream from '../features/commandCenter/EventStream.jsx'
import LoadingState from '../components/LoadingState.jsx'
import '../styles/SimulationPage.css'

const EVENTS = [
  { type: 'FLOOD_RISING', label: 'Flood Rising', icon: Waves, description: 'Increases risk on roads connecting the most affected zone.' },
  { type: 'ROAD_BLOCKED', label: 'Road Blocked', icon: TriangleAlert, description: 'Blocks Road R1 and triggers adaptive rerouting.' },
  { type: 'HOSPITAL_OVERLOAD', label: 'Hospital Overloaded', icon: HeartPulse, description: 'Pushes Hospital H2 to critical capacity.' },
  { type: 'SHELTER_FULL', label: 'Shelter Full', icon: Home, description: 'Fills Shelter S2 and redirects evacuation.' },
  { type: 'TEAM_UNAVAILABLE', label: 'Team Unavailable', icon: UserX, description: 'Marks an active team unavailable mid-response.' },
  { type: 'NEW_INCIDENT', label: 'New Incident', icon: Siren, description: 'Reports a new incident and auto-dispatches a team.' },
  { type: 'SUPPLY_SHORTAGE', label: 'Supply Shortage', icon: PackageMinus, description: 'Depletes a critical resource stockpile.' },
]

const STATUS_BADGE = { RUNNING: 'badge-success', PAUSED: 'badge-warning', IDLE: 'badge-neutral' }

export default function SimulationPage() {
  const { user } = useAuth()
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [firing, setFiring] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const canAct = user?.role === 'COMMANDER' || user?.role === 'OPERATOR'

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { state } = await getSimulationState()
      setState(state)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleControl(fn) {
    const { state } = await fn()
    setState(state)
  }

  async function handleEvent(type) {
    setFiring(type)
    setLastResult(null)
    try {
      const { result } = await triggerEvent(type)
      setLastResult({ type, result })
    } catch (err) {
      setLastResult({ type, error: err.response?.data?.message || 'Event failed.' })
    } finally {
      setFiring(null)
    }
  }

  if (loading) return <LoadingState label="Loading simulation state..." />

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title"><FlaskConical /> Disaster Simulation Control</h1>
          <p className="sim-scenario">Scenario: {state?.scenario || 'PATNA FLOOD RESPONSE'}</p>
        </div>
        <span className={`badge ${STATUS_BADGE[state?.status] || 'badge-neutral'}`}>
          {state?.status || 'IDLE'}
        </span>
      </div>

      <div className="card sim-data-card">
        <p className="sim-data-label">Simulation Data</p>
        <p className="sim-data-text">
          Population affected: <strong>{state?.populationAffected?.toLocaleString('en-IN')}</strong>
          {' '}&middot; All data on this page is fictional and used for demonstration only.
        </p>
      </div>

      {canAct && (
        <div className="card sim-controls">
          <button onClick={() => handleControl(startSimulation)} className="btn btn-primary"><Play style={{ width: 16, height: 16 }} /> Start</button>
          <button onClick={() => handleControl(pauseSimulation)} className="btn btn-secondary"><Pause style={{ width: 16, height: 16 }} /> Pause</button>
          <button onClick={() => handleControl(resumeSimulation)} className="btn btn-secondary"><Play style={{ width: 16, height: 16 }} /> Resume</button>
          <button onClick={() => handleControl(resetSimulation)} className="btn btn-secondary btn-text-critical"><RotateCcw style={{ width: 16, height: 16 }} /> Reset</button>
        </div>
      )}

      <div className="sim-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="sim-events-grid">
            {EVENTS.map((e) => (
              <button
                key={e.type}
                disabled={!canAct || firing === e.type}
                onClick={() => handleEvent(e.type)}
                className="card sim-event-btn"
              >
                <div className="sim-event-head">
                  {firing === e.type ? <Loader2 className="animate-spin" /> : <e.icon />}
                  <p className="sim-event-title">{e.label}</p>
                </div>
                <p className="sim-event-desc">{e.description}</p>
              </button>
            ))}
          </div>

          {lastResult && (
            <div className="card sim-result-card">
              <p className="section-label" style={{ marginBottom: 8 }}>Last Event Result — {EVENTS.find((e) => e.type === lastResult.type)?.label}</p>
              {lastResult.error ? (
                <p style={{ fontSize: 14, color: 'var(--critical-600)' }}>{lastResult.error}</p>
              ) : (
                <pre className="sim-result-pre">
                  {JSON.stringify(summarizeResult(lastResult.result), null, 2)}
                </pre>
              )}
            </div>
          )}

          {!canAct && (
            <div className="card sim-readonly-note">
              Your role (VIEWER) has read-only access. Sign in as an Operator or Commander to trigger simulation events.
            </div>
          )}
        </div>

        <EventStream />
      </div>
    </div>
  )
}

function summarizeResult(result) {
  if (!result) return {}
  const { road, hospital, shelter, team, alternate, invalidatedPlans, results, incident, decision } = result
  return {
    ...(road && { road: { id: road.roadId, status: road.status } }),
    ...(hospital && { hospital: { name: hospital.name, status: hospital.status } }),
    ...(shelter && { shelter: { name: shelter.name, status: shelter.status } }),
    ...(team && { team: { name: team.name, status: team.status } }),
    ...(alternate && { alternate: alternate.name }),
    ...(incident && { incident: incident.incidentId }),
    ...(decision && { decision: decision.decision }),
    ...(invalidatedPlans && { invalidatedPlans: invalidatedPlans.length }),
    ...(results && { newPlans: results.length }),
  }
}

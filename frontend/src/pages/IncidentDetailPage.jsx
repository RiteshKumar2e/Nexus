import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload, Sparkles, Users, Package, Clock, ScrollText } from 'lucide-react'
import { getIncident } from '../services/incidents.js'
import { analyzeEvidence } from '../services/ai.js'
import { getDecisionLog } from '../services/decisionLog.js'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import DisasterMap from '../features/map/DisasterMap.jsx'
import { getZoneName } from '../data/zones.js'
import { timeAgo, formatTime } from '../utils/format.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useToast } from '../context/ToastContext.jsx'
import '../styles/IncidentDetailPage.css'

export default function IncidentDetailPage() {
  const { id } = useParams()
  const [incident, setIncident] = useState(null)
  useDocumentTitle(incident ? `Incident ${incident.incidentId}` : 'Incident')
  const { showToast } = useToast()
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { incident } = await getIncident(id)
      setIncident(incident)
      const { items } = await getDecisionLog({ search: incident.incidentId })
      setDecisions(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load incident.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('incidentId', id)
      await analyzeEvidence(formData)
      showToast('Evidence uploaded and analyzed.', 'success')
      await load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed.', 'error')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  if (loading) return <LoadingState label="Loading incident..." />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!incident) return null

  return (
    <div className="page page-max-5xl">
      <Link to="/incidents" className="detail-back-link">
        <ArrowLeft /> Back to incidents
      </Link>

      <div className="card detail-header-card">
        <div className="detail-header-top">
          <div>
            <p className="detail-id">{incident.incidentId}</p>
            <h1 className="detail-heading">{incident.type.replace(/_/g, ' ')}</h1>
            <p className="detail-zone">{getZoneName(incident.district)}</p>
          </div>
          <div className="detail-badges">
            <StatusBadge status={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
        </div>
        <p className="detail-description">{incident.description}</p>
      </div>

      <div className="detail-stat-grid">
        <div className="card detail-stat-card">
          <p className="section-label" style={{ marginBottom: 4 }}>Population Impact</p>
          <p className="detail-stat-value" style={{ fontSize: 20 }}>{incident.populationImpact}</p>
          <p style={{ fontSize: 11, color: 'var(--ink-400)', marginTop: 2 }}>Qualitative estimate — Response Simulation</p>
        </div>
        <div className="card detail-stat-card">
          <p className="section-label" style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Users style={{ width: 14, height: 14 }} /> Assigned Team</p>
          <p className="detail-stat-name">{incident.assignedTeam?.name || 'Unassigned'}</p>
        </div>
        <div className="card detail-stat-card">
          <p className="section-label" style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Package style={{ width: 14, height: 14 }} /> Required Resources</p>
          <div className="detail-resource-tags">
            {incident.requiredResources?.length ? incident.requiredResources.map((r) => <span key={r} className="badge badge-neutral">{r}</span>) : <span style={{ fontSize: 12, color: 'var(--ink-400)' }}>None specified</span>}
          </div>
        </div>
      </div>

      <div className="card detail-map-card">
        <DisasterMap incidents={[incident]} teams={incident.assignedTeam ? [incident.assignedTeam] : []} roads={[]} />
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title"><Sparkles /> AI Assessment</p>
        {incident.aiAssessment ? (
          <p style={{ fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6 }}>{incident.aiAssessment}</p>
        ) : (
          <p style={{ fontSize: 14, color: 'var(--ink-400)' }}>No AI assessment yet. Upload field evidence below to generate one.</p>
        )}

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--ink-100)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-700)', marginBottom: 8 }}>Evidence</p>
          <div className="detail-evidence-thumbs">
            {incident.evidence?.map((ev, i) => (
              <img key={i} src={`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}${ev.url}`} alt="evidence" className="detail-evidence-thumb" />
            ))}
          </div>
          <label className="btn btn-secondary detail-evidence-upload">
            <Upload style={{ width: 14, height: 14 }} /> {uploading ? 'Analyzing...' : 'Upload evidence photo'}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title"><Clock /> Timeline</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="detail-timeline-row">Created <strong>{formatTime(incident.createdAt)}</strong> ({timeAgo(incident.createdAt)})</p>
          <p className="detail-timeline-row">Last updated <strong>{formatTime(incident.updatedAt)}</strong> ({timeAgo(incident.updatedAt)})</p>
        </div>
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title"><ScrollText /> Decision History</p>
        {decisions.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--ink-400)' }}>No related decisions recorded yet.</p>
        ) : (
          <div>
            {decisions.map((d) => (
              <div key={d._id} className="detail-decision-item">
                <p className="detail-decision-title">#{d.decisionNumber} — {d.decision}</p>
                <p className="detail-decision-reason">{d.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

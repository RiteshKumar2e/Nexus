import { useState, useEffect, useCallback } from 'react'
import { Sparkles, AlertTriangle, ListChecks, Boxes, GitBranch, Check, X, Loader2 } from 'lucide-react'
import { getPlans, approvePlan, rejectPlan } from '../services/plans.js'
import { queryCopilot } from '../services/ai.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/AIPlannerPage.css'

export default function AIPlannerPage() {
  useDocumentTitle('AI Planner')
  const { user } = useAuth()
  const { socket } = useSocket()
  const { showToast } = useToast()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [acting, setActing] = useState(false)
  const [risk, setRisk] = useState(null)
  const [riskLoading, setRiskLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await getPlans({ limit: 5 })
      setPlans(items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load response plans.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (!socket) return
    const refresh = () => load()
    ;['plan:activated', 'plan:created', 'plan:invalidated', 'plan:approved', 'plan:rejected'].forEach((e) => socket.on(e, refresh))
    return () => ['plan:activated', 'plan:created', 'plan:invalidated', 'plan:approved', 'plan:rejected'].forEach((e) => socket.off(e, refresh))
  }, [socket, load])

  const current = plans[0]
  const conflicts = plans.filter((p) => p.previousPlan && p._id !== current?._id)
  const canAct = user?.role === 'COMMANDER' || user?.role === 'OPERATOR'

  async function generateRisk() {
    setRiskLoading(true)
    try {
      const { answer } = await queryCopilot('Provide a concise risk assessment of the current operational situation.')
      setRisk(answer)
    } catch {
      setRisk('Risk assessment is temporarily unavailable.')
    } finally {
      setRiskLoading(false)
    }
  }

  async function handleApprove() {
    if (!current) return
    setActing(true)
    try {
      await approvePlan(current._id)
      showToast(`Plan #${current.planNumber} approved.`, 'success')
      await load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve plan.', 'error')
    } finally {
      setActing(false)
    }
  }
  async function handleReject() {
    if (!current) return
    setActing(true)
    try {
      await rejectPlan(current._id, 'Rejected from AI Planner')
      showToast(`Plan #${current.planNumber} rejected.`, 'info')
      await load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject plan.', 'error')
    } finally {
      setActing(false)
    }
  }

  if (loading) return <LoadingState label="Loading AI planner..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page page-max-5xl">
      <h1 className="page-title"><Sparkles /> AI Planner</h1>

      {!current ? (
        <EmptyState icon={Sparkles} title="No response plan yet" description="Trigger a simulation event to generate one." />
      ) : (
        <>
          <div className="card planner-card">
            <p className="section-label" style={{ marginBottom: 8 }}>Current Situation</p>
            <p style={{ fontSize: 14, color: 'var(--ink-700)' }}>
              Plan <strong>#{current.planNumber}</strong> — {current.trigger}
            </p>
          </div>

          <div className="card planner-card">
            <div className="planner-risk-header">
              <p className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle style={{ width: 14, height: 14 }} /> Risk Assessment</p>
              <button onClick={generateRisk} disabled={riskLoading} className="btn btn-secondary btn-sm">
                {riskLoading ? <Loader2 className="animate-spin" style={{ width: 14, height: 14 }} /> : <Sparkles style={{ width: 14, height: 14 }} />}
                Generate
              </button>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6 }}>
              {risk || 'Click "Generate" for an AI narrative risk assessment grounded in live operational data.'}
            </p>
          </div>

          <div className="card planner-card">
            <p className="section-label" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><ListChecks style={{ width: 14, height: 14 }} /> Recommended Actions</p>
            <div className="planner-actions-list">
              {current.actions.map((a, i) => (
                <div key={i} className="planner-action-row">
                  <span style={{ color: 'var(--ink-700)' }}>{a.description}</span>
                  {a.etaMin != null && <span className="planner-action-eta">{a.etaMin} min</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="planner-two-col">
            <div className="card planner-card">
              <p className="section-label" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Boxes style={{ width: 14, height: 14 }} /> Affected Resources</p>
              <div className="planner-resource-tags">
                {current.affectedResources.map((r) => <span key={r} className="badge badge-neutral">{r}</span>)}
              </div>
            </div>
            <div className="card planner-card">
              <p className="section-label" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><GitBranch style={{ width: 14, height: 14 }} /> Potential Conflicts</p>
              {conflicts.length === 0 ? (
                <p style={{ fontSize: 14, color: 'var(--ink-400)' }}>None detected.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {conflicts.map((c) => (
                    <div key={c._id} className="planner-conflict-row">Plan #{c.planNumber} — <StatusBadge status={c.status} /></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card planner-card">
            <div className="planner-approval-header">
              <p className="section-label">Proposed Response Plan</p>
              <StatusBadge status={current.status} />
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink-500)', marginBottom: 16 }}>{current.estimatedImpact}</p>
            {canAct && current.status === 'ACTIVE' && (
              <div className="planner-approval-actions">
                <button onClick={handleApprove} disabled={acting} className="btn btn-primary"><Check style={{ width: 16, height: 16 }} /> Approve</button>
                <button className="btn btn-secondary">Modify</button>
                <button onClick={handleReject} disabled={acting} className="btn btn-secondary btn-text-critical"><X style={{ width: 16, height: 16 }} /> Reject</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { ClipboardList, ArrowRight, Check, X } from 'lucide-react'
import { getPlans, approvePlan, rejectPlan } from '../../services/plans.js'
import { useSocket } from '../../context/SocketContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import LoadingState from '../../components/LoadingState.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { getZoneName } from '../../data/zones.js'
import '../../styles/ActivePlanCard.css'

export default function ActivePlanCard() {
  const { socket } = useSocket()
  const { user } = useAuth()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { items } = await getPlans({ status: 'ACTIVE', limit: 1 })
      setPlan(items[0] || null)
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
    ;['plan:activated', 'plan:created', 'plan:invalidated', 'plan:approved', 'plan:rejected'].forEach((e) => socket.on(e, refresh))
    return () => ['plan:activated', 'plan:created', 'plan:invalidated', 'plan:approved', 'plan:rejected'].forEach((e) => socket.off(e, refresh))
  }, [socket, load])

  const canAct = user?.role === 'COMMANDER' || user?.role === 'OPERATOR'

  async function handleApprove() {
    if (!plan) return
    setActing(true)
    try {
      await approvePlan(plan._id)
      await load()
    } finally {
      setActing(false)
    }
  }

  async function handleReject() {
    if (!plan) return
    setActing(true)
    try {
      await rejectPlan(plan._id, 'Rejected by operator from Command Center')
      await load()
    } finally {
      setActing(false)
    }
  }

  return (
    <div className="card plancard">
      <div className="plancard-header">
        <ClipboardList style={{ width: 16, height: 16, color: 'var(--brand-600)' }} />
        <p className="plancard-title">Active Response Plan</p>
      </div>

      {loading ? (
        <LoadingState label="Loading active plan..." />
      ) : !plan ? (
        <EmptyState title="No active plan" description="Trigger a simulation event to generate a response plan." />
      ) : (
        <div className="plancard-body">
          <div className="plancard-top">
            <p className="plancard-number">PLAN #{plan.planNumber}</p>
            <StatusBadge status={plan.status} />
          </div>
          <p className="plancard-reason">
            <strong>Reason: </strong>
            {plan.trigger}
          </p>

          <div className="plancard-actions">
            {plan.actions.map((action, i) => (
              <div key={i} className="plancard-action-row">
                <ArrowRight style={{ width: 14, height: 14, color: 'var(--brand-500)', flexShrink: 0 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p className="plancard-action-desc">{action.description}</p>
                  {action.route?.length > 0 && (
                    <p className="plancard-action-route">{action.route.map((r) => getZoneName(r)).join(' → ')}</p>
                  )}
                </div>
                {action.etaMin != null && <span className="plancard-action-eta">{action.etaMin} min</span>}
              </div>
            ))}
          </div>

          {canAct && plan.status === 'ACTIVE' && (
            <div className="plancard-footer">
              <button onClick={handleApprove} disabled={acting} className="btn btn-primary">
                <Check style={{ width: 14, height: 14 }} /> Approve
              </button>
              <button className="btn btn-secondary">Modify</button>
              <button onClick={handleReject} disabled={acting} className="btn btn-secondary btn-text-critical">
                <X style={{ width: 14, height: 14 }} /> Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TriangleAlert, ArrowRight, CheckCircle2 } from 'lucide-react'
import '../../styles/AdaptiveResponseSection.css'

const STAGES = ['before', 'event', 'after']

export default function AdaptiveResponseSection() {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  const current = STAGES[stage]

  return (
    <section className="adaptive-section">
      <div className="container-page">
        <div className="adaptive-intro">
          <p className="section-label">Adaptive response</p>
          <h2>Watch the response adapt.</h2>
          <p>
            A single event can cascade through routes, teams, and facilities. NEXUS resolves the
            whole chain automatically.
          </p>
        </div>

        <div className="card adaptive-card">
          <div className="adaptive-dots">
            {STAGES.map((s, i) => (
              <span key={s} className={`adaptive-dot ${i === stage ? 'is-active' : ''}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {current === 'before' && (
              <motion.div key="before" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="adaptive-stage">
                <p className="badge badge-brand" style={{ marginBottom: 16, display: 'inline-flex' }}>PLAN 17 &middot; ACTIVE</p>
                <div className="adaptive-badge-row">
                  <span>Road R1</span>
                  <ArrowRight style={{ width: 16, height: 16, color: 'var(--ink-300)' }} />
                  <span>Zone B</span>
                </div>
                <p className="adaptive-note">Team Alpha en route via the primary corridor.</p>
              </motion.div>
            )}

            {current === 'event' && (
              <motion.div key="event" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="adaptive-stage">
                <div className="adaptive-icon-circle adaptive-icon-circle-critical">
                  <TriangleAlert style={{ width: 24, height: 24, color: 'var(--critical-600)' }} />
                </div>
                <p className="adaptive-event-text">"Road R1 blocked."</p>
                <p className="badge badge-neutral badge-strike" style={{ marginTop: 12, display: 'inline-flex' }}>PLAN 17 INVALIDATED</p>
              </motion.div>
            )}

            {current === 'after' && (
              <motion.div key="after" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="adaptive-stage">
                <div className="adaptive-icon-circle adaptive-icon-circle-success">
                  <CheckCircle2 style={{ width: 24, height: 24, color: 'var(--success-600)' }} />
                </div>
                <p className="badge badge-success" style={{ marginBottom: 16, display: 'inline-flex' }}>PLAN 18 &middot; ACTIVATED</p>
                <div className="adaptive-badge-row">
                  <span>R3</span>
                  <ArrowRight style={{ width: 16, height: 16, color: 'var(--ink-300)' }} />
                  <span>R7</span>
                  <ArrowRight style={{ width: 16, height: 16, color: 'var(--ink-300)' }} />
                  <span>Zone B</span>
                </div>
                <p className="adaptive-result-tag">Team Alpha &middot; REASSIGNED</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

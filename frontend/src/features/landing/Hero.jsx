import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Truck, Building2, TriangleAlert, Sparkles } from 'lucide-react'
import '../../styles/Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="container-page hero-grid">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="eyebrow hero-eyebrow"
          >
            Adaptive Disaster Response
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="hero-headline"
          >
            Disasters change by the minute.
            <br />
            Your response should too.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-subtext"
          >
            NEXUS helps emergency teams monitor evolving conditions, coordinate resources, and
            continuously adapt response plans through AI-assisted decision support.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hero-actions"
          >
            <Link to="/register" className="btn btn-primary">
              Launch Command Center <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <a href="#capabilities" className="btn btn-secondary">
              Explore the Platform
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hero-meta"
          >
            <span>Simulation Mode</span>
            <span className="hero-meta-dot" />
            <span>Human-in-the-loop</span>
            <span className="hero-meta-dot" />
            <span>Decision Support</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="hero-visual"
        >
          <div className="card hero-panel">
            <div className="hero-panel-header">
              <div className="hero-panel-header-left">
                <span className="status-dot animate-pulse-dot" style={{ background: 'var(--warning-500)' }} />
                <span className="hero-panel-title">PLAN #18 &middot; ACTIVE</span>
              </div>
              <span className="badge badge-brand" style={{ fontSize: 10 }}>LIVE</span>
            </div>

            <div className="hero-map">
              <svg viewBox="0 0 400 260" style={{ width: '100%', height: '100%' }}>
                <rect width="400" height="260" fill="#F5F7F8" />
                <path d="M40 210 L150 150 L230 150 L360 60" stroke="#C7CED4" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M150 150 L150 40" stroke="#DC3D3D" strokeWidth="5" fill="none" strokeDasharray="2 8" strokeLinecap="round" />
                <path d="M150 150 L260 200 L340 190" stroke="#2563D6" strokeWidth="5" fill="none" strokeLinecap="round" />
                <circle cx="150" cy="150" r="7" fill="#DC3D3D" />
                <circle cx="40" cy="210" r="6" fill="#2563D6" />
                <circle cx="340" cy="190" r="6" fill="#2FA96B" />
                <circle cx="360" cy="60" r="6" fill="#7B5CC7" />
              </svg>
              <div className="hero-map-tag hero-map-tag-critical">
                <TriangleAlert style={{ width: 12, height: 12, color: 'var(--critical-600)' }} />
                <span className="hero-map-tag-text" style={{ color: 'var(--critical-700)' }}>R1 BLOCKED</span>
              </div>
              <div className="hero-map-tag hero-map-tag-success">
                <Truck style={{ width: 12, height: 12, color: 'var(--success-600)' }} />
                <span className="hero-map-tag-text" style={{ color: 'var(--success-700)' }}>TEAM ALPHA REROUTED</span>
              </div>
            </div>

            <div className="hero-panel-note">
              <Sparkles style={{ width: 14, height: 14, color: 'var(--brand-600)', flexShrink: 0 }} />
              <p>
                Road R1 blocked &rarr; Route R3&rarr;R7 calculated &rarr; Team Alpha reassigned to Zone B.
              </p>
            </div>
          </div>

          <div className="card hero-float-card hero-float-card-bottom">
            <div className="hero-float-card-label">
              <MapPin style={{ width: 14, height: 14 }} />
              <span>Hospital H2</span>
            </div>
            <p className="hero-float-card-value" style={{ color: 'var(--warning-600)' }}>82%</p>
            <p className="hero-float-card-sub">Capacity &middot; Monitoring</p>
          </div>

          <div className="card hero-float-card hero-float-card-top">
            <div className="hero-float-card-label">
              <Building2 style={{ width: 14, height: 14 }} />
              <span>Shelter S2</span>
            </div>
            <p className="hero-float-card-value" style={{ color: 'var(--ink-800)' }}>70%</p>
            <p className="hero-float-card-sub">Occupied &middot; Available</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

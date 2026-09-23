import { GridIcon, PinIcon, AlertIcon, UsersIcon, SparkIcon } from './icons.jsx'
import '../../styles/HeroPreview.css'

const NAV = [
  { label: 'Command Center', icon: GridIcon, active: true },
  { label: 'Live Map', icon: PinIcon },
  { label: 'Incidents', icon: AlertIcon },
  { label: 'Response Teams', icon: UsersIcon },
  { label: 'AI Planner', icon: SparkIcon },
]

const STATS = [
  { value: '26', label: 'Active Incidents' },
  { value: '9', label: 'Critical', tone: 'critical' },
  { value: '20', label: 'Districts' },
]

const ROWS = [
  { tone: 'critical', text: 'Bhagalpur — boat evacuation underway near Naugachia' },
  { tone: 'warning', text: 'Kishanganj — NH31 submerged, rerouting relief convoys' },
  { tone: 'success', text: 'Purnea — relief camps and kitchens operating' },
]

export default function HeroPreview() {
  return (
    <div className="hero-preview" aria-hidden="true">
      <div className="hero-preview-frame">
        <div className="hero-preview-topbar">
          <div className="hero-preview-dots">
            <span /><span /><span />
          </div>
          <p className="hero-preview-titlebar">NEXUS — Command Center</p>
          <span className="hero-preview-live">
            <span className="hero-preview-live-dot" /> LIVE
          </span>
        </div>

        <div className="hero-preview-body">
          <div className="hero-preview-sidebar">
            {NAV.map((item) => (
              <div key={item.label} className={`hero-preview-nav-item ${item.active ? 'is-active' : ''}`}>
                <item.icon />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-preview-main">
            <div className="hero-preview-stats">
              {STATS.map((s) => (
                <div key={s.label} className={`hero-preview-stat ${s.tone ? `is-${s.tone}` : ''}`}>
                  <p className="hero-preview-stat-value">{s.value}</p>
                  <p className="hero-preview-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="hero-preview-list">
              {ROWS.map((r) => (
                <div key={r.text} className="hero-preview-row">
                  <span className={`hero-preview-row-dot is-${r.tone}`} />
                  <span>{r.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import '../styles/OpsPages.css'

export default function OpsPageHeader({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="ops-header">
      <div className="ops-header-main">
        <div className="ops-header-icon"><Icon /></div>
        <div style={{ minWidth: 0 }}>
          <div className="ops-header-title-row">
            <h1 className="ops-header-title">{title}</h1>
            <span className="ops-sim-chip">Simulated data</span>
          </div>
          <p className="ops-header-sub">{subtitle}</p>
        </div>
      </div>
      {children && <div className="ops-header-actions">{children}</div>}
    </div>
  )
}

import '../../styles/MetricCard.css'

export default function MetricCard({ icon: Icon, label, value, sub, tone = 'neutral' }) {
  return (
    <div className="card metric-card">
      <div className="metric-card-label-row">
        {Icon && <Icon />}
        <p className="metric-card-label">{label}</p>
      </div>
      <p className={`metric-card-value metric-card-value-${tone}`}>{value}</p>
      {sub && <p className="metric-card-sub">{sub}</p>}
    </div>
  )
}

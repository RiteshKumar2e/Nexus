import '../styles/OpsPages.css'

export default function SummaryStrip({ items }) {
  return (
    <div className="ops-summary">
      {items.map((s) => (
        <div key={s.label} className={`ops-summary-item ${s.tone ? `is-${s.tone}` : ''}`}>
          <p className="ops-summary-value">{s.value}</p>
          <p className="ops-summary-label">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

import { Search } from 'lucide-react'
import '../styles/OpsPages.css'

export default function OpsToolbar({ query, onQuery, placeholder, filters, active, onFilter }) {
  return (
    <div className="ops-toolbar">
      <div className="ops-search">
        <Search />
        <input
          className="input"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      <div className="ops-pills">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onFilter(f.value)}
            className={`ops-pill ${active === f.value ? 'is-active' : ''}`}
          >
            {f.label}
            <span className="ops-pill-count">{f.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

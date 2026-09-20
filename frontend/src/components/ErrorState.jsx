import { AlertTriangle, RefreshCw } from 'lucide-react'
import '../styles/StateViews.css'

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="state-view">
      <div className="state-icon-circle state-icon-circle-critical">
        <AlertTriangle style={{ width: 20, height: 20, color: 'var(--critical-600)' }} />
      </div>
      <p className="state-description">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm">
          <RefreshCw style={{ width: 14, height: 14 }} /> Retry
        </button>
      )}
    </div>
  )
}

import { Loader2 } from 'lucide-react'
import '../styles/StateViews.css'

export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="state-view state-view-inline">
      <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} />
      <span className="state-label">{label}</span>
    </div>
  )
}

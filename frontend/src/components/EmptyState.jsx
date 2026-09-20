import { Inbox } from 'lucide-react'
import '../styles/StateViews.css'

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description }) {
  return (
    <div className="state-view">
      <div className="state-icon-circle state-icon-circle-neutral">
        <Icon style={{ width: 20, height: 20, color: 'var(--ink-400)' }} />
      </div>
      <p className="state-title">{title}</p>
      {description && <p className="state-description">{description}</p>}
    </div>
  )
}

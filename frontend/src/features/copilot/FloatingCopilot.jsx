import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import CopilotPanel from './CopilotPanel.jsx'
import '../../styles/FloatingCopilot.css'

export default function FloatingCopilot() {
  const [open, setOpen] = useState(false)

  return (
    <div className="floating-copilot">
      {open && (
        <div className="floating-copilot-panel">
          <button
            className="floating-copilot-close"
            onClick={() => setOpen(false)}
            aria-label="Close AI copilot"
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
          <CopilotPanel />
        </div>
      )}
      <button
        className="floating-copilot-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close AI copilot' : 'Open AI copilot'}
      >
        {open ? <X style={{ width: 24, height: 24 }} /> : <MessageCircle style={{ width: 24, height: 24 }} />}
      </button>
    </div>
  )
}

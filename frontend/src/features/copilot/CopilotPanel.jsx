import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import { queryCopilot } from '../../services/ai.js'
import '../../styles/CopilotPanel.css'

const SUGGESTIONS = [
  'Which district is most critical?',
  'Why was SDRF Team 1 reassigned?',
  'Which medical unit can accept patients?',
  'What changed in the last 10 minutes?',
]

export default function CopilotPanel() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Ask me about live incidents, teams, medical units, relief camps, or the active response plan.", source: 'system' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function ask(question) {
    if (!question.trim() || loading) return
    setMessages((m) => [...m, { role: 'user', text: question }])
    setInput('')
    setLoading(true)
    try {
      const { answer, source } = await queryCopilot(question)
      setMessages((m) => [...m, { role: 'assistant', text: answer, source }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: err.response?.data?.message || 'Unable to reach the copilot right now.', source: 'error' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card copilot">
      <div className="copilot-header">
        <Sparkles style={{ width: 16, height: 16, color: 'var(--brand-600)' }} />
        <p className="copilot-title">AI Response Copilot</p>
      </div>

      <div ref={scrollRef} className="copilot-messages">
        {messages.map((m, i) => (
          <div key={i} className={`copilot-row copilot-row-${m.role}`}>
            <div className={`copilot-bubble copilot-bubble-${m.role === 'user' ? 'user' : 'assistant'}`}>
              {m.text}
              {m.source === 'deterministic' && (
                <p className="copilot-bubble-note">AI narrative unavailable — showing live data summary.</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="copilot-thinking">
            <Loader2 className="animate-spin" style={{ width: 14, height: 14 }} /> Analyzing current situation...
          </div>
        )}
      </div>

      <div className="copilot-suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => ask(s)} className="copilot-suggestion-btn">
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
        className="copilot-form"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask NEXUS..."
          className="input"
        />
        <button type="submit" disabled={loading} className="btn btn-primary">
          <Send style={{ width: 16, height: 16 }} />
        </button>
      </form>
    </div>
  )
}

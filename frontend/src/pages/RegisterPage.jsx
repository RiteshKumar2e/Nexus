import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/AuthPages.css'

const ROLES = [
  { value: 'COMMANDER', label: 'Commander', description: 'Full operational control and plan approval.' },
  { value: 'OPERATOR', label: 'Operator', description: 'Manage incidents, teams, and resources.' },
  { value: 'VIEWER', label: 'Viewer', description: 'Read-only access to the command center.' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'OPERATOR' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/command-center', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <Link to="/" className="auth-back-link">
        <ArrowLeft /> Back to home
      </Link>
      <div className="auth-form-side">
        <div className="auth-form-box">
          <Logo />
          <h1 className="auth-title">Launch Command Center</h1>
          <p className="auth-subtitle">Create an operator account for the simulation.</p>

          {error && (
            <div className="auth-error">
              <AlertCircle style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form">
            <div>
              <label className="field-label">Full name</label>
              <input
                required
                className="input"
                placeholder="Anjali Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                required
                className="input"
                placeholder="you@agency.gov"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <PasswordInput
                minLength={6}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label" style={{ marginBottom: 8 }}>Role</label>
              <div className="auth-role-list">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={`radio-option ${form.role === r.value ? 'is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={form.role === r.value}
                      onChange={() => setForm({ ...form, role: r.value })}
                    />
                    <div>
                      <p className="radio-option-title">{r.label}</p>
                      <p className="radio-option-description">{r.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? 'Creating account...' : 'Create account'} <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </form>

          <p className="auth-footnote">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="auth-visual-side">
        <div className="auth-visual-glow" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(37,99,214,0.25), transparent 60%)' }} />
        <div className="auth-visual-content">
          <p className="eyebrow auth-visual-eyebrow">Adaptive Intelligence</p>
          <h2 className="auth-visual-title">
            Every account operates inside a labeled simulation environment.
          </h2>
          <p className="auth-visual-text">
            No real emergency infrastructure is controlled by this platform. All data shown is fictional.
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/AuthPages.css'

export default function LoginPage() {
  useDocumentTitle('Sign In')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      const dest = location.state?.from?.pathname || '/command-center'
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Check your credentials.')
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
          <h1 className="auth-title">Sign in to NEXUS</h1>
          <p className="auth-subtitle">Access the adaptive command center.</p>

          {error && (
            <div className="auth-error">
              <AlertCircle style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form">
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
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? 'Signing in...' : 'Sign in'} <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </form>

          <p className="auth-footnote">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
          <p className="auth-demo-hint">
            Demo: commander@nexus.io / operator@nexus.io / viewer@nexus.io &middot; password "password123"
          </p>
        </div>
      </div>

      <div className="auth-visual-side">
        <div className="auth-visual-content">
          <p className="eyebrow auth-visual-eyebrow">Bihar Flood Response 2026</p>
          <h2 className="auth-visual-title">
            "When the situation changes, the response changes."
          </h2>
          <p className="auth-visual-text">
            Emergency coordination for flood-affected Bihar districts, built for authorized emergency operators.
          </p>
        </div>
      </div>
    </div>
  )
}

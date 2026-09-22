import { useState } from 'react'
import { Settings as SettingsIcon, User, KeyRound } from 'lucide-react'
import PasswordInput from '../components/PasswordInput.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function SettingsPage() {
  useDocumentTitle('Settings')
  const { user, updateProfile, updatePassword } = useAuth()
  const { showToast } = useToast()

  const [name, setName] = useState(user?.name || '')
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '' })
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  async function onSaveProfile(e) {
    e.preventDefault()
    if (!name.trim() || name.trim() === user?.name) return
    setSavingProfile(true)
    try {
      await updateProfile(name.trim())
      showToast('Profile updated.', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to update profile.', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  async function onSavePassword(e) {
    e.preventDefault()
    setPasswordError('')
    setSavingPassword(true)
    try {
      await updatePassword(passwordForm.current, passwordForm.next)
      showToast('Password updated.', 'success')
      setPasswordForm({ current: '', next: '' })
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Unable to update password.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="page page-max-4xl">
      <h1 className="page-title">
        <SettingsIcon /> Settings
      </h1>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <User style={{ width: 16, height: 16, color: 'var(--brand-600)' }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-800)' }}>Account</p>
        </div>

        <form onSubmit={onSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="field-label">Full name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input className="input" value={user?.email || ''} disabled />
          </div>
          <div>
            <label className="field-label" style={{ marginBottom: 8 }}>Role</label>
            <div>
              <StatusBadge status={user?.role} />
            </div>
          </div>
          <button
            type="submit"
            disabled={savingProfile || !name.trim() || name.trim() === user?.name}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            {savingProfile ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <KeyRound style={{ width: 16, height: 16, color: 'var(--brand-600)' }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-800)' }}>Change password</p>
        </div>

        {passwordError && (
          <p style={{ fontSize: 13, color: 'var(--critical-600)', marginBottom: 12 }}>{passwordError}</p>
        )}

        <form onSubmit={onSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="field-label">Current password</label>
            <PasswordInput
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
              placeholder="Current password"
            />
          </div>
          <div>
            <label className="field-label">New password</label>
            <PasswordInput
              minLength={8}
              value={passwordForm.next}
              onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))}
              placeholder="At least 8 characters"
            />
          </div>
          <button
            type="submit"
            disabled={savingPassword || !passwordForm.current || passwordForm.next.length < 8}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            {savingPassword ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}

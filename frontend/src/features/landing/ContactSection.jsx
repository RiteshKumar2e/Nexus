import { useState } from 'react'
import { submitContact } from '../../services/contact.js'
import { ZONES } from '../../data/zones.js'
import { CheckCircleIcon, AlertIcon } from './icons.jsx'
import '../../styles/ContactSection.css'

const INQUIRY_OPTIONS = [
  { value: 'DEMO_REQUEST', label: 'Request a demo' },
  { value: 'PARTNERSHIP', label: 'Agency / NGO partnership' },
  { value: 'EMERGENCY_COORDINATION', label: 'Emergency coordination' },
  { value: 'VOLUNTEER', label: 'Volunteer with us' },
  { value: 'OTHER', label: 'Something else' },
]

const DISTRICTS = ZONES.filter((z) => z.type === 'district')
  .map((z) => ({ id: z.id, name: z.name.replace(/\s*\(.*\)$/, '') }))
  .sort((a, b) => a.name.localeCompare(b.name))

const EMPTY = {
  name: '', phone: '', email: '', organization: '',
  district: '', address: '', inquiryType: 'DEMO_REQUEST', message: '',
}

export default function ContactSection() {
  const [form, setForm] = useState(EMPTY)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await submitContact(form)
      setSent(true)
      setForm(EMPTY)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="container-page contact-layout">
        <div className="contact-intro">
          <p className="eyebrow">Contact</p>
          <h2 className="contact-heading">Talk to the NEXUS team.</h2>
          <p className="contact-text">
            Request a walkthrough, discuss a deployment with your agency, or ask how the
            platform handles your district. We usually reply within one working day.
          </p>

          <div className="contact-emergency">
            <AlertIcon />
            <div>
              <p className="contact-emergency-title">In an emergency, don't use this form.</p>
              <p className="contact-emergency-text">Call <strong>112</strong>, India's national emergency number.</p>
            </div>
          </div>

          <ul className="contact-points">
            <li><span>Response time</span><strong>Within 1 working day</strong></li>
            <li><span>Coverage</span><strong>Flood-affected Bihar districts</strong></li>
          </ul>
        </div>

        <div className="contact-card">
          {sent ? (
            <div className="contact-success">
              <CheckCircleIcon />
              <h3>Message received</h3>
              <p>Thanks for reaching out. Someone from the team will get back to you on the phone number or email you shared.</p>
              <button type="button" className="btn btn-secondary" onClick={() => setSent(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="contact-form">
              <div className="contact-row">
                <label className="contact-field">
                  <span className="field-label">Full name <em>*</em></span>
                  <input className="input" required maxLength={120} value={form.name} onChange={set('name')} placeholder="Anjali Sharma" />
                </label>
                <label className="contact-field">
                  <span className="field-label">Phone number <em>*</em></span>
                  <input
                    className="input"
                    type="tel"
                    required
                    inputMode="tel"
                    pattern="[+\d][\d\s\-]{7,18}"
                    title="Enter a valid phone number"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+91 98765 43210"
                  />
                </label>
              </div>

              <div className="contact-row">
                <label className="contact-field">
                  <span className="field-label">Email</span>
                  <input className="input" type="email" maxLength={160} value={form.email} onChange={set('email')} placeholder="you@agency.gov.in" />
                </label>
                <label className="contact-field">
                  <span className="field-label">Organization / Agency</span>
                  <input className="input" maxLength={160} value={form.organization} onChange={set('organization')} placeholder="District Disaster Management Authority" />
                </label>
              </div>

              <div className="contact-row">
                <label className="contact-field">
                  <span className="field-label">District</span>
                  <select className="input" value={form.district} onChange={set('district')}>
                    <option value="">Select district</option>
                    {DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    <option value="OTHER">Other / outside Bihar</option>
                  </select>
                </label>
                <label className="contact-field">
                  <span className="field-label">Reason for contact</span>
                  <select className="input" value={form.inquiryType} onChange={set('inquiryType')}>
                    {INQUIRY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>
              </div>

              <label className="contact-field">
                <span className="field-label">Address</span>
                <input className="input" maxLength={500} value={form.address} onChange={set('address')} placeholder="Block / village, district, PIN code" />
              </label>

              <label className="contact-field">
                <span className="field-label">Message <em>*</em></span>
                <textarea
                  className="input contact-textarea"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Tell us what you need help with..."
                />
              </label>

              {error && (
                <p className="contact-error" role="alert"><AlertIcon /> {error}</p>
              )}

              <div className="contact-actions">
                <p className="contact-privacy">Fields marked * are required. We only use your details to reply to you.</p>
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

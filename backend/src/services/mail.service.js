import axios from 'axios'

const RESEND_URL = 'https://api.resend.com/emails'

const INQUIRY_LABELS = {
  DEMO_REQUEST: 'Request a demo',
  PARTNERSHIP: 'Agency / NGO partnership',
  EMERGENCY_COORDINATION: 'Emergency coordination',
  VOLUNTEER: 'Volunteer',
  OTHER: 'Other',
}

const escapeHtml = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export async function sendContactNotification(entry) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_INBOX
  if (!apiKey || !to) {
    console.warn('[mail] RESEND_API_KEY or CONTACT_INBOX not set — contact message saved but not emailed.')
    return
  }

  const rows = [
    ['Name', entry.name],
    ['Phone', entry.phone],
    ['Email', entry.email],
    ['Organization', entry.organization],
    ['District', entry.district],
    ['Address', entry.address],
    ['Reason', INQUIRY_LABELS[entry.inquiryType] || entry.inquiryType],
  ].filter(([, v]) => v)

  const html = `
    <div style="font-family:Arial,sans-serif;color:#172033;max-width:560px">
      <h2 style="margin:0 0 16px">New NEXUS contact message</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows.map(([k, v]) => `
          <tr>
            <td style="padding:6px 12px 6px 0;color:#5c6b82;white-space:nowrap;vertical-align:top">${k}</td>
            <td style="padding:6px 0">${escapeHtml(v)}</td>
          </tr>`).join('')}
      </table>
      <p style="margin:20px 0 6px;color:#5c6b82;font-size:13px">Message</p>
      <div style="white-space:pre-wrap;padding:12px 14px;background:#fcfaf5;border:1px solid #e6e9ee;border-radius:8px;font-size:14px">${escapeHtml(entry.message)}</div>
    </div>`

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', 'Message:', entry.message].join('\n')

  await axios.post(
    RESEND_URL,
    {
      from: process.env.MAIL_FROM || 'NEXUS Contact <onboarding@resend.dev>',
      to: [to],
      subject: `NEXUS contact: ${entry.name} — ${INQUIRY_LABELS[entry.inquiryType] || 'Message'}`,
      html,
      text,
      ...(entry.email && { reply_to: entry.email }),
    },
    {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      timeout: 10000,
    }
  )
}

import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function PrivacyPage() {
  useDocumentTitle('Privacy Policy')

  return (
    <div className="page page-max-5xl" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <h1 className="page-title" style={{ marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, color: 'var(--ink-400)', marginBottom: 32 }}>Last updated: 22 September 2026</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.7, maxWidth: 720 }}>
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>What we collect</h2>
          <p>
            Creating an account stores your name, email address, and a bcrypt-hashed password (never the
            password itself) in our database. Signing in stores a session token and your name/role in your
            browser's local storage, so you stay signed in between visits — this never leaves your device
            except when sent to our own API to authenticate requests.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>AI features</h2>
          <p>
            The AI Response Copilot sends your question, together with the current simulated operational data
            (incidents, teams, plans — never your account password), to Groq and/or Google Gemini to generate
            an answer. If you upload an evidence photo for AI analysis, that image is sent to Google Gemini's
            vision API and stored on our server so it can be displayed back to you on the incident record.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>What we don't do</h2>
          <p>
            We don't run analytics or advertising trackers on this application, we don't sell data to third
            parties, and we don't process payments (there's nothing to buy here — this is a demonstration
            prototype).
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>Operational simulation data</h2>
          <p>
            Almost everything else in the application — incidents, districts, teams, resources, medical
            units, relief camps — is simulated scenario content, not personal data about any real person.
            See <a href="/data-sources" style={{ color: 'var(--brand-700)' }}>Data Sources</a> for the
            distinction between verified public context and simulated figures.
          </p>
        </section>

        <section style={{ padding: 16, background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', border: '1px dashed var(--ink-200)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--warning-700)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6 }}>Draft — needs review</p>
          <p style={{ fontSize: 13 }}>
            This prototype doesn't yet have an in-app account-deletion or data-export flow, a defined data
            retention period, or a named data controller/jurisdiction. Until those exist, email the contact
            address below to request account deletion and it will be handled manually.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>Contact</h2>
          <p>
            Privacy questions or deletion requests: <a href="mailto:contact@nexus-response.example" style={{ color: 'var(--brand-700)' }}>contact@nexus-response.example</a>{' '}
            <span style={{ color: 'var(--ink-400)' }}>(placeholder — update before launch)</span>.
          </p>
        </section>
      </div>
    </div>
  )
}

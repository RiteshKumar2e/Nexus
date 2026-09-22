import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function TermsPage() {
  useDocumentTitle('Terms of Service')

  return (
    <div className="page page-max-5xl" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <h1 className="page-title" style={{ marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ fontSize: 13, color: 'var(--ink-400)', marginBottom: 32 }}>Last updated: 22 September 2026</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.7, maxWidth: 720 }}>
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>What NEXUS is</h2>
          <p>
            NEXUS is a response-simulation prototype: a disaster-coordination dashboard built to demonstrate
            adaptive planning software, using a fictionalized Bihar Flood 2026 scenario. It is not a
            government system, does not monitor or control real emergency infrastructure, and no decision
            made in this application has any real-world operational effect.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>Accounts</h2>
          <p>
            Creating an account requires a name, email address, and password. You're responsible for keeping
            your credentials confidential and for activity under your account. Roles (Commander, Operator,
            Viewer) only control what you can do inside this simulation — they don't represent real authority
            or affiliation with any agency.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>Acceptable use</h2>
          <p>
            Don't use this application to misrepresent simulated content as real emergency information, don't
            attempt to disrupt or abuse the service, and don't upload content you don't have the right to
            upload (the evidence-photo feature is a demonstration of an AI vision workflow, not a real
            incident-reporting channel).
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>No warranty</h2>
          <p>
            This is prototype software provided as-is, without warranty of any kind. Simulated operational
            figures, AI-generated explanations, and AI copilot answers may be incomplete or wrong — see{' '}
            <a href="/data-sources" style={{ color: 'var(--brand-700)' }}>Data Sources</a> for what's verified
            versus simulated. Do not rely on this application for any real emergency response.
          </p>
        </section>

        <section style={{ padding: 16, background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', border: '1px dashed var(--ink-200)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--warning-700)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6 }}>Draft — needs review</p>
          <p style={{ fontSize: 13 }}>
            The operating entity, contact address, and governing jurisdiction for this service have not been
            filled in yet. Fill in before this is presented as a live product rather than a prototype demo.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>Contact</h2>
          <p>
            Questions about these terms: <a href="mailto:contact@nexus-response.example" style={{ color: 'var(--brand-700)' }}>contact@nexus-response.example</a>{' '}
            <span style={{ color: 'var(--ink-400)' }}>(placeholder — update before launch)</span>.
          </p>
        </section>
      </div>
    </div>
  )
}

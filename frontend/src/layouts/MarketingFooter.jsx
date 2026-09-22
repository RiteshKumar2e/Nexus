import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import '../styles/MarketingFooter.css'

// TODO: replace with a real inbox before this ships publicly.
const CONTACT_EMAIL = 'contact@nexus-response.example'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Command Center', to: '/command-center' },
      { label: 'Live Map', to: '/command-center/map' },
      { label: 'Adaptive Planning', to: '/#adaptive' },
      { label: 'AI Copilot', to: '/ai-planner' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Incidents', to: '/incidents' },
      { label: 'Districts', to: '/districts' },
      { label: 'Response Teams', to: '/teams' },
      { label: 'Resources', to: '/resources' },
      { label: 'Medical Response', to: '/medical' },
      { label: 'Relief Camps', to: '/relief-camps' },
    ],
  },
  {
    title: 'Simulation',
    links: [
      { label: 'Simulation Control', to: '/simulation' },
      { label: 'Decision Log', to: '/decision-log' },
      { label: 'Analytics', to: '/analytics' },
    ],
  },
  {
    title: 'Technology',
    links: [
      { label: 'Multi-Agent System', to: '/#technology' },
      { label: 'Adaptive Response Engine', to: '/#adaptive' },
      { label: 'Data Sources', to: '/data-sources' },
    ],
  },
]

export default function MarketingFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container-page site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Logo />
            <p className="site-footer-tagline">
              Adaptive Intelligence for Bihar Flood Response.
            </p>
            <p className="site-footer-mode">
              Response Simulation &middot; Decision-support only
            </p>
            <p className="site-footer-contact">
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="site-footer-col-title">{col.title}</p>
              <ul className="site-footer-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to.startsWith('/#') ? (
                      <a href={link.to.slice(1)}>{link.label}</a>
                    ) : (
                      <Link to={link.to}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="site-footer-bottom">
          <p>&copy; {new Date().getFullYear()} NEXUS. Publicly reported Bihar flood context is used for scenario framing; operational records shown are simulated for demonstration. See <Link to="/data-sources">Data Sources</Link>.</p>
          <p>Built for responsible, human-controlled emergency decision support. <Link to="/terms">Terms</Link> &middot; <Link to="/privacy">Privacy</Link></p>
        </div>
      </div>
    </footer>
  )
}

import Logo from '../components/Logo.jsx'
import '../styles/MarketingFooter.css'

const COLUMNS = [
  {
    title: 'Product',
    links: ['Command Center', 'Live Map', 'Adaptive Planning', 'AI Copilot'],
  },
  {
    title: 'Platform',
    links: ['Incidents', 'Response Teams', 'Resources', 'Hospitals & Shelters'],
  },
  {
    title: 'Simulation',
    links: ['Scenario Library', 'Event Console', 'Decision Log'],
  },
  {
    title: 'Technology',
    links: ['Multi-Agent System', 'Route Engine', 'Replanning Engine'],
  },
]

export default function MarketingFooter() {
  return (
    <footer className="site-footer">
      <div className="container-page site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Logo />
            <p className="site-footer-tagline">
              Adaptive Intelligence for Disaster Response.
            </p>
            <p className="site-footer-mode">
              Simulation Mode &middot; Decision-support only
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="site-footer-col-title">{col.title}</p>
              <ul className="site-footer-links">
                {col.links.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="site-footer-bottom">
          <p>&copy; {new Date().getFullYear()} NEXUS. All fictional data for demonstration purposes.</p>
          <p>Built for responsible, human-controlled emergency decision support.</p>
        </div>
      </div>
    </footer>
  )
}

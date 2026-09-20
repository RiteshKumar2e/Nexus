import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/MarketingHeader.css'

const NAV = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Simulation', href: '#simulation' },
  { label: 'Technology', href: '#technology' },
]

export default function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container-page site-header-row">
        <Logo />

        <nav className="site-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="site-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header-actions">
          {user ? (
            <button onClick={() => navigate('/command-center')} className="btn btn-primary">
              Command Center <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Sign in</Link>
              <Link to="/register" className="btn btn-primary">
                Launch Command Center
              </Link>
            </>
          )}
        </div>

        <button className="site-header-burger" onClick={() => setOpen((v) => !v)}>
          {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
        </button>
      </div>

      {open && (
        <div className="site-mobile-menu">
          <div className="site-mobile-menu-inner">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="site-mobile-link">
                {item.label}
              </a>
            ))}
            <div className="site-mobile-actions">
              {user ? (
                <Link to="/command-center" className="btn btn-primary">Command Center</Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary">Sign in</Link>
                  <Link to="/register" className="btn btn-primary">Launch Command Center</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

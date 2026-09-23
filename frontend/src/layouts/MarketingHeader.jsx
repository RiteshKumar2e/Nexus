import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MenuIcon, CloseIcon } from '../features/landing/icons.jsx'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/MarketingHeader.css'

const NAV = [
  { label: 'Home', sectionId: null },
  { label: 'About', sectionId: 'about' },
  { label: 'Features', sectionId: 'features' },
  { label: 'How it works', sectionId: 'how-it-works' },
  { label: 'Contact', sectionId: 'contact' },
]

export default function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  function goToSection(sectionId) {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      window.setTimeout(() => scrollToSection(sectionId), 50)
      return
    }
    scrollToSection(sectionId)
  }

  function scrollToSection(sectionId) {
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container-page site-header-row">
        <Logo />

        <nav className="site-nav">
          {NAV.map((item) => (
            <button key={item.label} type="button" onClick={() => goToSection(item.sectionId)} className="site-nav-link">
              {item.label}
            </button>
          ))}
        </nav>

        <div className="site-header-actions">
          <Link to={user ? '/command-center' : '/login'} className="btn btn-primary">
            {user ? 'Command Center' : 'Sign in'}
          </Link>
        </div>

        <button className="site-header-burger" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <CloseIcon style={{ width: 20, height: 20 }} /> : <MenuIcon style={{ width: 20, height: 20 }} />}
        </button>
      </div>

      {open && (
        <div className="site-mobile-menu">
          <div className="site-mobile-menu-inner">
            {NAV.map((item) => (
              <button key={item.label} type="button" onClick={() => goToSection(item.sectionId)} className="site-mobile-link">
                {item.label}
              </button>
            ))}
            <div className="site-mobile-actions">
              <Link to={user ? '/command-center' : '/login'} className="btn btn-primary">
                {user ? 'Command Center' : 'Sign in'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

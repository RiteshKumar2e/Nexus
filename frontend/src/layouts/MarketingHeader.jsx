import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/MarketingHeader.css'

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Contact', href: '#contact' },
]

export default function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

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
          {NAV.map((item) =>
            item.to ? (
              <Link key={item.label} to={item.to} className="site-nav-link">
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className="site-nav-link">
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="site-header-actions">
          <Link to={user ? '/command-center' : '/login'} className="btn btn-primary">
            {user ? 'Command Center' : 'Sign in'}
          </Link>
        </div>

        <button className="site-header-burger" onClick={() => setOpen((v) => !v)}>
          {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
        </button>
      </div>

      {open && (
        <div className="site-mobile-menu">
          <div className="site-mobile-menu-inner">
            {NAV.map((item) =>
              item.to ? (
                <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className="site-mobile-link">
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="site-mobile-link">
                  {item.label}
                </a>
              )
            )}
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

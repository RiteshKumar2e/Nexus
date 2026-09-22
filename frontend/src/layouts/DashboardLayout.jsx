import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Siren,
  MapPinned,
  Users,
  Package,
  Stethoscope,
  Home,
  CookingPot,
  Bell,
  Sparkles,
  ScrollText,
  BarChart3,
  FlaskConical,
  Info,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import Logo from '../components/Logo.jsx'
import FloatingCopilot from '../features/copilot/FloatingCopilot.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import '../styles/DashboardLayout.css'

const NAV = [
  { to: '/command-center', label: 'Command Center', icon: LayoutDashboard, end: true },
  { to: '/command-center/map', label: 'Live Map', icon: Map },
  { to: '/incidents', label: 'Incidents', icon: Siren },
  { to: '/districts', label: 'Districts', icon: MapPinned },
  { to: '/teams', label: 'Response Teams', icon: Users },
  { to: '/resources', label: 'Resources', icon: Package },
  { to: '/medical', label: 'Medical Response', icon: Stethoscope },
  { to: '/relief-camps', label: 'Relief Camps', icon: Home },
  { to: '/community-kitchens', label: 'Community Kitchens', icon: CookingPot },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/ai-planner', label: 'AI Planner', icon: Sparkles },
  { to: '/decision-log', label: 'Decision Log', icon: ScrollText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/simulation', label: 'Simulation', icon: FlaskConical },
  { to: '/data-sources', label: 'Data Sources', icon: Info },
]

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  function handleLogout() {
    logout()
    navigate('/')
    showToast('Signed out.', 'info')
    onNavigate?.()
  }

  return (
    <div className="dash-sidebar-inner">
      <div className="dash-sidebar-header">
        <Logo to="/" />
      </div>
      <nav className="dash-sidebar-nav">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => `dash-nav-link ${isActive ? 'is-active' : ''}`}
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="dash-sidebar-footer">
        <button className="dash-settings-btn">
          <Settings style={{ width: 18, height: 18 }} /> Settings
        </button>
        <div className="dash-user-row">
          <div className="dash-user-info">
            <div className="dash-avatar">
              {(user?.name || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="dash-user-name">{user?.name || 'Operator'}</p>
              <p className="dash-user-role">{user?.role || 'VIEWER'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="dash-exit-btn">
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { connected } = useSocket()

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="dash-mobile-overlay">
          <div className="dash-mobile-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="dash-mobile-panel">
            <button className="dash-mobile-close" onClick={() => setMobileOpen(false)}>
              <X style={{ width: 20, height: 20 }} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button className="dash-topbar-burger" onClick={() => setMobileOpen(true)}>
              <Menu style={{ width: 20, height: 20 }} />
            </button>
            <div style={{ minWidth: 0 }}>
              <p className="dash-topbar-title">BIHAR FLOOD RESPONSE</p>
              <div className="dash-topbar-status">
                <span className="dash-status-live">
                  <span className="status-dot animate-pulse-dot" style={{ background: 'var(--success-500)' }} /> RESPONSE SIMULATION ACTIVE
                </span>
                <span className="dash-topbar-extra">&middot; Bihar &middot; September 2026</span>
                <span className="dash-topbar-connection">
                  &middot; <span className="status-dot" style={{ background: connected ? 'var(--success-500)' : 'var(--ink-300)' }} />
                  {connected ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <div className="dash-topbar-actions">
            <button className="dash-bell-btn">
              <Bell style={{ width: 18, height: 18 }} />
              <span className="dash-bell-dot" />
            </button>
          </div>
        </header>
        <main className="dash-content">
          <Outlet />
        </main>
      </div>

      <FloatingCopilot />
    </div>
  )
}

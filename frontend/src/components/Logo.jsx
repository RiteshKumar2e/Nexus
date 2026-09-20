import { Link } from 'react-router-dom'
import '../styles/Logo.css'

export default function Logo({ to = '/', size = 'md', className = '' }) {
  const dimClass = `logo-mark-${size}`
  const textClass = `logo-text-${size}`

  const content = (
    <div className={`logo ${className}`}>
      <div className={`logo-mark ${dimClass}`}>
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M9 22V10L23 22V10" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className={`logo-text ${textClass}`}>NEXUS</span>
    </div>
  )

  if (!to) return content
  return <Link to={to}>{content}</Link>
}

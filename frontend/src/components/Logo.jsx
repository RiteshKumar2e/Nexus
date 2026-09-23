import { Link } from 'react-router-dom'
import '../styles/Logo.css'

export default function Logo({ to = '/', size = 'md', className = '' }) {
  const textClass = `logo-text-${size}`

  const content = (
    <div className={`logo ${className}`}>
      <span className={`logo-text ${textClass}`}>NEXUS</span>
    </div>
  )

  if (!to) return content
  return <Link to={to}>{content}</Link>
}

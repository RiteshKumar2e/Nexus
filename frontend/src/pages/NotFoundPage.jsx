import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import '../styles/NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="notfound-shell">
      <Logo />
      <p className="notfound-code">404</p>
      <p className="notfound-text">This page doesn't exist in the current simulation.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  )
}

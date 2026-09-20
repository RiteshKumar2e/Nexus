import { Outlet } from 'react-router-dom'
import MarketingHeader from './MarketingHeader.jsx'
import MarketingFooter from './MarketingFooter.jsx'
import '../styles/MarketingLayout.css'

export default function MarketingLayout() {
  return (
    <div className="marketing-layout">
      <MarketingHeader />
      <main className="marketing-layout-main">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  )
}

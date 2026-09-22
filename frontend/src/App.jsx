import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import MarketingLayout from './layouts/MarketingLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoadingState from './components/LoadingState.jsx'

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const CommandCenterPage = lazy(() => import('./pages/CommandCenterPage.jsx'))
const LiveMapPage = lazy(() => import('./pages/LiveMapPage.jsx'))
const IncidentsPage = lazy(() => import('./pages/IncidentsPage.jsx'))
const IncidentDetailPage = lazy(() => import('./pages/IncidentDetailPage.jsx'))
const DistrictsPage = lazy(() => import('./pages/DistrictsPage.jsx'))
const DistrictDetailPage = lazy(() => import('./pages/DistrictDetailPage.jsx'))
const TeamsPage = lazy(() => import('./pages/TeamsPage.jsx'))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage.jsx'))
const MedicalUnitsPage = lazy(() => import('./pages/MedicalUnitsPage.jsx'))
const ReliefCampsPage = lazy(() => import('./pages/ReliefCampsPage.jsx'))
const CommunityKitchensPage = lazy(() => import('./pages/CommunityKitchensPage.jsx'))
const AlertsPage = lazy(() => import('./pages/AlertsPage.jsx'))
const AIPlannerPage = lazy(() => import('./pages/AIPlannerPage.jsx'))
const DecisionLogPage = lazy(() => import('./pages/DecisionLogPage.jsx'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx'))
const SimulationPage = lazy(() => import('./pages/SimulationPage.jsx'))
const DataSourcesPage = lazy(() => import('./pages/DataSourcesPage.jsx'))
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

export default function App() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingState label="Loading NEXUS..." /></div>}>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/data-sources" element={<DataSourcesPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/command-center" element={<CommandCenterPage />} />
          <Route path="/command-center/map" element={<LiveMapPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/districts" element={<DistrictsPage />} />
          <Route path="/districts/:id" element={<DistrictDetailPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/medical" element={<MedicalUnitsPage />} />
          <Route path="/relief-camps" element={<ReliefCampsPage />} />
          <Route path="/community-kitchens" element={<CommunityKitchensPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/ai-planner" element={<AIPlannerPage />} />
          <Route path="/decision-log" element={<DecisionLogPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

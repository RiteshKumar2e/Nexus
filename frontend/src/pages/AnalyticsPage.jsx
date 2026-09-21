import { useMemo, useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'
import { useLiveOperationalData } from '../hooks/useLiveOperationalData.js'
import { getResources } from '../services/resources.js'
import LoadingState from '../components/LoadingState.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/AnalyticsPage.css'

const SEVERITY_COLORS = { LOW: '#4B7A52', MEDIUM: '#C97A2E', HIGH: '#A83A3A', CRITICAL: '#8A2E2E' }
const MEDICAL_STATUS_COLORS = { AVAILABLE: '#4B7A52', LIMITED: '#C97A2E', HIGH_DEMAND: '#A83A3A', CRITICAL: '#8A2E2E' }
const CAMP_STATUS_COLORS = { AVAILABLE: '#4B7A52', NEAR_CAPACITY: '#C97A2E', FULL: '#A83A3A' }

function countBy(list, key, order) {
  const counts = Object.fromEntries(order.map((k) => [k, 0]))
  list.forEach((item) => { if (counts[item[key]] !== undefined) counts[item[key]] += 1 })
  return order.map((name) => ({ name: name.replace(/_/g, ' '), key: name, value: counts[name] }))
}

export default function AnalyticsPage() {
  useDocumentTitle('Analytics')
  const { incidents, medicalUnits, reliefCamps, loading } = useLiveOperationalData()
  const [resources, setResources] = useState([])

  useEffect(() => {
    getResources().then(({ items }) => setResources(items)).catch(() => {})
  }, [])

  const severityData = useMemo(() => {
    const counts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
    incidents.forEach((i) => { counts[i.severity] = (counts[i.severity] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [incidents])

  const typeData = useMemo(() => {
    const counts = {}
    incidents.forEach((i) => { counts[i.type] = (counts[i.type] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }))
  }, [incidents])

  const medicalStatusData = useMemo(() => countBy(medicalUnits, 'status', ['AVAILABLE', 'LIMITED', 'HIGH_DEMAND', 'CRITICAL']), [medicalUnits])
  const campStatusData = useMemo(() => countBy(reliefCamps, 'capacityStatus', ['AVAILABLE', 'NEAR_CAPACITY', 'FULL']), [reliefCamps])
  const resourceData = useMemo(() => resources.map((r) => ({ name: r.name, available: r.available, allocated: r.allocated, consumed: r.consumed })), [resources])

  if (loading) return <LoadingState label="Loading analytics..." />

  return (
    <div className="page">
      <h1 className="page-title"><BarChart3 /> Analytics</h1>
      <p className="page-subtext" style={{ marginBottom: 16 }}>Operational Simulation &middot; derived from current response-simulation records.</p>

      <div className="analytics-grid">
        <div className="card analytics-card">
          <p className="section-label" style={{ marginBottom: 16 }}>Incidents by Severity</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {severityData.map((d) => <Cell key={d.name} fill={SEVERITY_COLORS[d.name]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card analytics-card">
          <p className="section-label" style={{ marginBottom: 16 }}>Incidents by Type</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={typeData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD8C8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#C89B3C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card analytics-card">
          <p className="section-label" style={{ marginBottom: 16 }}>Medical Support Status</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={medicalStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD8C8" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Medical units" radius={[4, 4, 0, 0]}>
                {medicalStatusData.map((d) => <Cell key={d.key} fill={MEDICAL_STATUS_COLORS[d.key]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card analytics-card">
          <p className="section-label" style={{ marginBottom: 16 }}>Relief Camp Capacity Status</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={campStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD8C8" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Relief camps" radius={[4, 4, 0, 0]}>
                {campStatusData.map((d) => <Cell key={d.key} fill={CAMP_STATUS_COLORS[d.key]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card analytics-card analytics-card-wide">
          <p className="section-label" style={{ marginBottom: 16 }}>Resource Allocation</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD8C8" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="available" stackId="a" fill="#4B7A52" name="Available" />
              <Bar dataKey="allocated" stackId="a" fill="#C89B3C" name="Allocated" />
              <Bar dataKey="consumed" stackId="a" fill="#A3A59A" name="Consumed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

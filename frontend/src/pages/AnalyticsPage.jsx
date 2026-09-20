import { useMemo, useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'
import { useLiveOperationalData } from '../hooks/useLiveOperationalData.js'
import { getResources } from '../services/resources.js'
import LoadingState from '../components/LoadingState.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import '../styles/AnalyticsPage.css'

const SEVERITY_COLORS = { LOW: '#2FA96B', MEDIUM: '#E4A11A', HIGH: '#DC3D3D', CRITICAL: '#A82A2A' }

export default function AnalyticsPage() {
  useDocumentTitle('Analytics')
  const { incidents, hospitals, shelters, loading } = useLiveOperationalData()
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

  const hospitalData = useMemo(() => hospitals.map((h) => ({ name: h.name.split('—')[1]?.trim() || h.name, load: h.currentLoadPct })), [hospitals])
  const shelterData = useMemo(() => shelters.map((s) => ({ name: s.name.split('—')[1]?.trim() || s.name, occupancy: Math.round((s.occupied / s.capacity) * 100) })), [shelters])
  const resourceData = useMemo(() => resources.map((r) => ({ name: r.name, available: r.available, allocated: r.allocated, consumed: r.consumed })), [resources])

  if (loading) return <LoadingState label="Loading analytics..." />

  return (
    <div className="page">
      <h1 className="page-title"><BarChart3 /> Analytics</h1>

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
              <CartesianGrid strokeDasharray="3 3" stroke="#E7EBEE" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563D6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card analytics-card">
          <p className="section-label" style={{ marginBottom: 16 }}>Hospital Load (%)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hospitalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7EBEE" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip />
              <Bar dataKey="load" radius={[4, 4, 0, 0]}>
                {hospitalData.map((d, i) => <Cell key={i} fill={d.load >= 90 ? '#DC3D3D' : d.load >= 75 ? '#E4A11A' : '#2FA96B'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card analytics-card">
          <p className="section-label" style={{ marginBottom: 16 }}>Shelter Occupancy (%)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={shelterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7EBEE" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip />
              <Bar dataKey="occupancy" radius={[4, 4, 0, 0]}>
                {shelterData.map((d, i) => <Cell key={i} fill={d.occupancy >= 100 ? '#DC3D3D' : d.occupancy >= 85 ? '#E4A11A' : '#2FA96B'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card analytics-card analytics-card-wide">
          <p className="section-label" style={{ marginBottom: 16 }}>Resource Allocation</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7EBEE" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="available" stackId="a" fill="#2FA96B" name="Available" />
              <Bar dataKey="allocated" stackId="a" fill="#2563D6" name="Allocated" />
              <Bar dataKey="consumed" stackId="a" fill="#9CA6B0" name="Consumed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

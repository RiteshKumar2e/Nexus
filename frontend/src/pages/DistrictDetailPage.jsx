import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Siren, Home, Package, Stethoscope, CookingPot } from 'lucide-react'
import { getDistrict } from '../services/districts.js'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import DisasterMap from '../features/map/DisasterMap.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function DistrictDetailPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  useDocumentTitle(data?.district ? data.district.name : 'District')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await getDistrict(id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load district.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  if (loading) return <LoadingState label="Loading district..." />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!data) return null

  const { district, incidents, teams, medicalUnits, reliefCamps, resources, communityKitchens } = data

  return (
    <div className="page page-max-5xl">
      <Link to="/districts" className="detail-back-link">
        <ArrowLeft /> Back to districts
      </Link>

      <div className="card detail-header-card">
        <div className="detail-header-top">
          <div>
            <h1 className="detail-heading">{district.name}</h1>
            <p className="detail-zone">River: {district.river}</p>
          </div>
          <div className="detail-badges">
            <StatusBadge status={district.riskLevel} />
            <StatusBadge status={district.status} />
          </div>
        </div>
        <p className="detail-description">{district.affectedArea}</p>
        <p style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 8 }}>Response type: {district.responseType}</p>
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title">Priority Needs</p>
        <div className="detail-resource-tags">
          {(district.priorityNeeds || []).map((n) => <span key={n} className="badge badge-neutral">{n}</span>)}
        </div>
      </div>

      <div className="card detail-map-card">
        <DisasterMap
          incidents={incidents}
          teams={teams}
          medicalUnits={medicalUnits}
          reliefCamps={reliefCamps}
          communityKitchens={communityKitchens}
          districts={[district]}
          roads={[]}
        />
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title"><Siren /> Active Incidents ({incidents.length})</p>
        {incidents.length === 0 ? <p style={{ fontSize: 14, color: 'var(--ink-400)' }}>No active incidents.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {incidents.map((inc) => (
              <Link key={inc._id} to={`/incidents/${inc._id}`} className="detail-timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{inc.incidentId} &middot; {inc.type.replace(/_/g, ' ')}</span>
                <StatusBadge status={inc.severity} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title"><Package /> Rescue Resources ({teams.length} teams)</p>
        {teams.length === 0 ? <p style={{ fontSize: 14, color: 'var(--ink-400)' }}>No teams staged in this district.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {teams.map((t) => (
              <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>{t.name}</span>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        )}
        {resources.length > 0 && (
          <div className="detail-resource-tags" style={{ marginTop: 10 }}>
            {resources.map((r) => <span key={r._id} className="badge badge-neutral">{r.name} · {r.status.replace(/_/g, ' ')}</span>)}
          </div>
        )}
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title"><Stethoscope /> Medical Support</p>
        {medicalUnits.length === 0 ? <p style={{ fontSize: 14, color: 'var(--ink-400)' }}>No medical units recorded.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {medicalUnits.map((m) => (
              <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>{m.name}</span>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title"><Home /> Relief Camps</p>
        {reliefCamps.length === 0 ? <p style={{ fontSize: 14, color: 'var(--ink-400)' }}>No relief camps recorded.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reliefCamps.map((c) => (
              <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>{c.name}</span>
                <StatusBadge status={c.capacityStatus} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card detail-section-card">
        <p className="detail-section-title"><CookingPot /> Community Kitchens</p>
        {communityKitchens.length === 0 ? <p style={{ fontSize: 14, color: 'var(--ink-400)' }}>No community kitchens recorded.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {communityKitchens.map((k) => (
              <div key={k._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>{k.name}</span>
                <StatusBadge status={k.foodSupplyStatus} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

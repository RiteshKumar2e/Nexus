import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { makeDivIcon, ROAD_COLORS, RISK_COLORS } from './mapIcons.js'
import { getZoneCoords, getZoneName, ZONES } from '../../data/zones.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import '../../styles/DisasterMap.css'

// Bihar-wide view, centered roughly on the Ganga/Kosi flood-affected belt.
const CENTER = [25.9, 86.3]
const ZOOM = 7

function jitter(coords, seed) {
  const hash = String(seed)
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const dx = ((hash % 17) - 8) * 0.006
  const dy = (((hash * 7) % 17) - 8) * 0.006
  return [coords[0] + dx, coords[1] + dy]
}

function FitOnData({ bounds }) {
  const map = useMap()
  useEffect(() => {
    if (bounds?.length) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 10 })
    }
  }, [map, bounds])
  return null
}

export default function DisasterMap({
  incidents = [],
  teams = [],
  medicalUnits = [],
  reliefCamps = [],
  communityKitchens = [],
  districts = [],
  roads = [],
  height = '100%',
}) {
  return (
    <MapContainer center={CENTER} zoom={ZOOM} style={{ height, width: '100%' }} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {(districts.length ? districts : ZONES.filter((z) => z.type === 'district')).map((d) => {
        const id = d.id
        const risk = d.riskLevel
        const coords = getZoneCoords(id)
        return (
          <Marker key={`district-${id}`} position={coords} icon={makeDivIcon('district', { color: risk ? RISK_COLORS[risk] : '#A3A59A' })}>
            <Popup minWidth={200}>
              <div className="map-popup">
                <p className="map-popup-title">{getZoneName(id)}</p>
                {d.river && <p className="map-popup-meta">River: {d.river}</p>}
                {risk && <p className="map-popup-meta">Risk level: <strong>{risk}</strong></p>}
                {d.status && <p className="map-popup-meta">Status: {d.status.replace(/_/g, ' ')}</p>}
              </div>
            </Popup>
          </Marker>
        )
      })}

      {roads.map((road) => {
        const from = getZoneCoords(road.from)
        const to = getZoneCoords(road.to)
        return (
          <Polyline
            key={road.roadId}
            positions={[from, to]}
            pathOptions={{
              color: ROAD_COLORS[road.status] || ROAD_COLORS.OPEN,
              weight: road.status === 'BLOCKED' ? 3 : 4,
              dashArray: road.status === 'BLOCKED' ? '2 8' : undefined,
              opacity: 0.85,
            }}
          >
            <Popup>
              <div className="map-popup">
                <p className="map-popup-title">{road.roadId}</p>
                <p className="map-popup-text">{getZoneName(road.from)} → {getZoneName(road.to)}</p>
                <p className="map-popup-meta">Status: <strong>{road.status}</strong></p>
              </div>
            </Popup>
          </Polyline>
        )
      })}

      {incidents.map((inc) => (
        <Marker
          key={inc._id}
          position={jitter(getZoneCoords(inc.district), inc.incidentId)}
          icon={makeDivIcon(inc.severity === 'CRITICAL' ? 'critical' : 'high', { pulse: inc.severity === 'CRITICAL' })}
        >
          <Popup minWidth={220}>
            <div className="map-popup">
              <div className="map-popup-header">
                <p className="map-popup-title">{inc.incidentId}</p>
                <StatusBadge status={inc.severity} />
              </div>
              <p className="map-popup-text">{inc.description}</p>
              <p className="map-popup-meta">District: {getZoneName(inc.district)}</p>
              <p className="map-popup-meta">Population impact: {inc.populationImpact}</p>
              <p className="map-popup-meta">Team: {inc.assignedTeam?.name || 'Unassigned'}</p>
              <p className="map-popup-meta">Status: {inc.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {teams.map((team) => (
        <Marker key={team._id} position={jitter(getZoneCoords(team.currentAssignment?.district || team.location), team.name)} icon={makeDivIcon('team')}>
          <Popup minWidth={200}>
            <div className="map-popup">
              <div className="map-popup-header">
                <p className="map-popup-title">{team.name}</p>
                <StatusBadge status={team.status} />
              </div>
              <p className="map-popup-meta">Type: {team.type}{team.agency ? ` · ${team.agency.replace(/_/g, ' ')}` : ''}</p>
              <p className="map-popup-meta">District: {getZoneName(team.currentAssignment?.district || team.location)}</p>
              {team.currentAssignment?.eta != null && <p className="map-popup-meta">ETA: {team.currentAssignment.eta} min</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {medicalUnits.map((m) => (
        <Marker key={m._id} position={jitter(getZoneCoords(m.district), m.name)} icon={makeDivIcon('medical')}>
          <Popup minWidth={200}>
            <div className="map-popup">
              <div className="map-popup-header">
                <p className="map-popup-title">{m.name}</p>
                <StatusBadge status={m.status} />
              </div>
              <p className="map-popup-meta">Doctors: {m.doctorsStatus?.replace(/_/g, ' ')}</p>
              <p className="map-popup-meta">Priority cases: {m.priorityCases}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {reliefCamps.map((c) => (
        <Marker key={c._id} position={jitter(getZoneCoords(c.district), c.name)} icon={makeDivIcon('camp')}>
          <Popup minWidth={200}>
            <div className="map-popup">
              <div className="map-popup-header">
                <p className="map-popup-title">{c.name}</p>
                <StatusBadge status={c.capacityStatus} />
              </div>
              <p className="map-popup-meta">Facilities: {(c.facilities || []).map((f) => f.replace(/_/g, ' ')).join(', ') || 'None listed'}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {communityKitchens.map((k) => (
        <Marker key={k._id} position={jitter(getZoneCoords(k.district), k.name)} icon={makeDivIcon('kitchen')}>
          <Popup minWidth={200}>
            <div className="map-popup">
              <div className="map-popup-header">
                <p className="map-popup-title">{k.name}</p>
                <StatusBadge status={k.status} />
              </div>
              <p className="map-popup-meta">Food supply: {k.foodSupplyStatus?.replace(/_/g, ' ')}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

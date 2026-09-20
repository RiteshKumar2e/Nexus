import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { makeDivIcon, ROAD_COLORS } from './mapIcons.js'
import { getZoneCoords, getZoneName } from '../../data/zones.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import '../../styles/DisasterMap.css'

const CENTER = [25.612, 85.13]

function jitter(coords, seed) {
  const hash = String(seed)
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const dx = ((hash % 17) - 8) * 0.0022
  const dy = (((hash * 7) % 17) - 8) * 0.0022
  return [coords[0] + dx, coords[1] + dy]
}

function FitOnData({ bounds }) {
  const map = useMap()
  useEffect(() => {
    if (bounds?.length) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 })
    }
  }, [map, bounds])
  return null
}

export default function DisasterMap({ incidents = [], teams = [], hospitals = [], shelters = [], roads = [], height = '100%' }) {
  return (
    <MapContainer center={CENTER} zoom={12} style={{ height, width: '100%' }} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

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
                <p className="map-popup-text">{road.from} → {road.to}</p>
                <p className="map-popup-meta">Status: <strong>{road.status}</strong></p>
              </div>
            </Popup>
          </Polyline>
        )
      })}

      {incidents.map((inc) => (
        <Marker
          key={inc._id}
          position={jitter(getZoneCoords(inc.zone), inc.incidentId)}
          icon={makeDivIcon(inc.severity === 'CRITICAL' ? 'critical' : 'high', { pulse: inc.severity === 'CRITICAL' })}
        >
          <Popup minWidth={220}>
            <div className="map-popup">
              <div className="map-popup-header">
                <p className="map-popup-title">{inc.incidentId}</p>
                <StatusBadge status={inc.severity} />
              </div>
              <p className="map-popup-text">{inc.description}</p>
              <p className="map-popup-meta">Zone: {getZoneName(inc.zone)}</p>
              <p className="map-popup-meta">Affected: {inc.affectedPopulation?.toLocaleString('en-IN')}</p>
              <p className="map-popup-meta">Team: {inc.assignedTeam?.name || 'Unassigned'}</p>
              <p className="map-popup-meta">Status: {inc.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {teams.map((team) => (
        <Marker key={team._id} position={jitter(getZoneCoords(team.currentAssignment?.zone || team.location), team.name)} icon={makeDivIcon('team')}>
          <Popup minWidth={200}>
            <div className="map-popup">
              <div className="map-popup-header">
                <p className="map-popup-title">{team.name}</p>
                <StatusBadge status={team.status} />
              </div>
              <p className="map-popup-meta">Type: {team.type}</p>
              <p className="map-popup-meta">Zone: {getZoneName(team.currentAssignment?.zone || team.location)}</p>
              {team.currentAssignment?.eta != null && <p className="map-popup-meta">ETA: {team.currentAssignment.eta} min</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {hospitals.map((h) => (
        <Marker key={h._id} position={jitter(getZoneCoords(h.location), h.name)} icon={makeDivIcon('hospital')}>
          <Popup minWidth={200}>
            <div className="map-popup">
              <div className="map-popup-header">
                <p className="map-popup-title">{h.name}</p>
                <StatusBadge status={h.status} />
              </div>
              <p className="map-popup-meta">Beds available: {h.availableBeds}/{h.totalBeds}</p>
              <p className="map-popup-meta">Load: {h.currentLoadPct}%</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {shelters.map((s) => (
        <Marker key={s._id} position={jitter(getZoneCoords(s.location), s.name)} icon={makeDivIcon('shelter')}>
          <Popup minWidth={200}>
            <div className="map-popup">
              <div className="map-popup-header">
                <p className="map-popup-title">{s.name}</p>
                <StatusBadge status={s.status} />
              </div>
              <p className="map-popup-meta">Occupied: {s.occupied}/{s.capacity}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

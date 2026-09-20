import { useEffect, useState, useCallback } from 'react'
import { getIncidents } from '../services/incidents.js'
import { getTeams } from '../services/teams.js'
import { getHospitals } from '../services/hospitals.js'
import { getShelters } from '../services/shelters.js'
import { getRoads } from '../services/roads.js'
import { useSocket } from '../context/SocketContext.jsx'

function upsert(list, item) {
  const idx = list.findIndex((x) => x._id === item._id)
  if (idx === -1) return [item, ...list]
  const copy = [...list]
  copy[idx] = item
  return copy
}

function upsertByKey(list, item, key) {
  const idx = list.findIndex((x) => x[key] === item[key])
  if (idx === -1) return [...list, item]
  const copy = [...list]
  copy[idx] = item
  return copy
}

export function useLiveOperationalData() {
  const { socket } = useSocket()
  const [incidents, setIncidents] = useState([])
  const [teams, setTeams] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [shelters, setShelters] = useState([])
  const [roads, setRoads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [i, t, h, s, r] = await Promise.all([
        getIncidents({ limit: 100 }),
        getTeams(),
        getHospitals(),
        getShelters(),
        getRoads(),
      ])
      setIncidents(i.items)
      setTeams(t.items)
      setHospitals(h.items)
      setShelters(s.items)
      setRoads(r.items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load operational data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  useEffect(() => {
    if (!socket) return

    const onIncidentCreated = ({ incident }) => setIncidents((l) => upsert(l, incident))
    const onIncidentUpdated = ({ incident }) => setIncidents((l) => upsert(l, incident))
    const onTeamUpdated = ({ team }) => setTeams((l) => upsert(l, team))
    const onHospitalUpdated = ({ hospital }) => setHospitals((l) => upsert(l, hospital))
    const onShelterUpdated = ({ shelter }) => setShelters((l) => upsert(l, shelter))
    const onRoadUpdated = ({ road }) => setRoads((l) => upsertByKey(l, road, 'roadId'))
    const onReset = () => loadAll()

    socket.on('incident:created', onIncidentCreated)
    socket.on('incident:updated', onIncidentUpdated)
    socket.on('team:updated', onTeamUpdated)
    socket.on('hospital:updated', onHospitalUpdated)
    socket.on('shelter:updated', onShelterUpdated)
    socket.on('road:blocked', onRoadUpdated)
    socket.on('road:updated', onRoadUpdated)
    socket.on('simulation:reset', onReset)

    return () => {
      socket.off('incident:created', onIncidentCreated)
      socket.off('incident:updated', onIncidentUpdated)
      socket.off('team:updated', onTeamUpdated)
      socket.off('hospital:updated', onHospitalUpdated)
      socket.off('shelter:updated', onShelterUpdated)
      socket.off('road:blocked', onRoadUpdated)
      socket.off('road:updated', onRoadUpdated)
      socket.off('simulation:reset', onReset)
    }
  }, [socket, loadAll])

  return { incidents, teams, hospitals, shelters, roads, loading, error, reload: loadAll }
}

import { useEffect, useState, useCallback } from 'react'
import { getIncidents } from '../services/incidents.js'
import { getTeams } from '../services/teams.js'
import { getMedicalUnits } from '../services/medicalUnits.js'
import { getReliefCamps } from '../services/reliefCamps.js'
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
  const [medicalUnits, setMedicalUnits] = useState([])
  const [reliefCamps, setReliefCamps] = useState([])
  const [roads, setRoads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [i, t, m, c, r] = await Promise.all([
        getIncidents({ limit: 100 }),
        getTeams(),
        getMedicalUnits(),
        getReliefCamps(),
        getRoads(),
      ])
      setIncidents(i.items)
      setTeams(t.items)
      setMedicalUnits(m.items)
      setReliefCamps(c.items)
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
    const onMedicalUnitUpdated = ({ medicalUnit }) => setMedicalUnits((l) => upsert(l, medicalUnit))
    const onReliefCampUpdated = ({ reliefCamp }) => setReliefCamps((l) => upsert(l, reliefCamp))
    const onRoadUpdated = ({ road }) => setRoads((l) => upsertByKey(l, road, 'roadId'))
    const onReset = () => loadAll()

    socket.on('incident:created', onIncidentCreated)
    socket.on('incident:updated', onIncidentUpdated)
    socket.on('team:updated', onTeamUpdated)
    socket.on('medicalUnit:updated', onMedicalUnitUpdated)
    socket.on('reliefCamp:updated', onReliefCampUpdated)
    socket.on('road:blocked', onRoadUpdated)
    socket.on('road:updated', onRoadUpdated)
    socket.on('simulation:reset', onReset)

    return () => {
      socket.off('incident:created', onIncidentCreated)
      socket.off('incident:updated', onIncidentUpdated)
      socket.off('team:updated', onTeamUpdated)
      socket.off('medicalUnit:updated', onMedicalUnitUpdated)
      socket.off('reliefCamp:updated', onReliefCampUpdated)
      socket.off('road:blocked', onRoadUpdated)
      socket.off('road:updated', onRoadUpdated)
      socket.off('simulation:reset', onReset)
    }
  }, [socket, loadAll])

  return { incidents, teams, medicalUnits, reliefCamps, roads, loading, error, reload: loadAll }
}

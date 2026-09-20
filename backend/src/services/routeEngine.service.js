import Road from '../models/Road.js'

// Roads with these statuses cannot be traversed at all.
const IMPASSABLE = new Set(['BLOCKED'])

// Congested/dangerous roads are traversable but carry a time penalty, which
// naturally makes Dijkstra prefer safer alternatives when one exists.
const STATUS_MULTIPLIER = {
  OPEN: 1,
  CONGESTED: 1.6,
  DANGEROUS: 2.2,
  BLOCKED: Infinity,
}

async function buildGraph() {
  const roads = await Road.findAll()
  const graph = new Map() // nodeId -> [{ to, roadId, weight, distanceKm }]

  for (const road of roads) {
    if (IMPASSABLE.has(road.status)) continue
    const weight = road.travelTimeMin * (STATUS_MULTIPLIER[road.status] ?? 1) * road.risk
    const edge = { roadId: road.roadId, weight, distanceKm: road.distanceKm }

    if (!graph.has(road.from)) graph.set(road.from, [])
    if (!graph.has(road.to)) graph.set(road.to, [])
    graph.get(road.from).push({ to: road.to, ...edge })
    graph.get(road.to).push({ to: road.from, ...edge })
  }

  return graph
}

/**
 * Dijkstra shortest path over the live road graph. Returns null when the
 * destination is unreachable given current road statuses (used to detect a
 * genuinely stranded team rather than silently picking a bad route).
 */
export async function findShortestRoute(fromNode, toNode) {
  const graph = await buildGraph()
  if (!graph.has(fromNode) || !graph.has(toNode)) return null

  const dist = new Map([[fromNode, 0]])
  const prevNode = new Map()
  const prevRoad = new Map()
  const visited = new Set()
  const queue = new Set(graph.keys())

  while (queue.size) {
    let current = null
    let currentDist = Infinity
    for (const node of queue) {
      const d = dist.has(node) ? dist.get(node) : Infinity
      if (d < currentDist) {
        currentDist = d
        current = node
      }
    }
    if (current === null) break
    queue.delete(current)
    visited.add(current)
    if (current === toNode) break

    for (const edge of graph.get(current) || []) {
      if (visited.has(edge.to)) continue
      const alt = currentDist + edge.weight
      if (alt < (dist.has(edge.to) ? dist.get(edge.to) : Infinity)) {
        dist.set(edge.to, alt)
        prevNode.set(edge.to, current)
        prevRoad.set(edge.to, { roadId: edge.roadId, distanceKm: edge.distanceKm, weight: edge.weight })
      }
    }
  }

  if (!dist.has(toNode) || dist.get(toNode) === Infinity) return null

  const route = [toNode]
  const roadsUsed = []
  let totalDistanceKm = 0
  let cursor = toNode
  while (cursor !== fromNode) {
    const prev = prevNode.get(cursor)
    const roadInfo = prevRoad.get(cursor)
    if (!prev) return null
    route.unshift(prev)
    roadsUsed.unshift(roadInfo.roadId)
    totalDistanceKm += roadInfo.distanceKm
    cursor = prev
  }

  return {
    route,
    roadsUsed,
    etaMin: Math.round(dist.get(toNode)),
    distanceKm: Math.round(totalDistanceKm * 10) / 10,
  }
}

export async function routeUsesRoad(route, roadId) {
  return route?.roadsUsed?.includes(roadId)
}

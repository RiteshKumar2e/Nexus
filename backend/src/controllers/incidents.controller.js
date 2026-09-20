import expressAsyncHandler from 'express-async-handler'
import { Op } from 'sequelize'
import Incident from '../models/Incident.js'
import ResponseTeam from '../models/ResponseTeam.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'

export const listIncidents = expressAsyncHandler(async (req, res) => {
  const { severity, status, type, zone, search, page = 1, limit = 20 } = req.query
  const where = {}
  if (severity) where.severity = severity
  if (status) where.status = status
  if (type) where.type = type
  if (zone) where.zone = zone
  if (search) {
    where[Op.or] = [
      { incidentId: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ]
  }

  const offset = (Number(page) - 1) * Number(limit)
  const { rows: items, count: total } = await Incident.findAndCountAll({
    where,
    include: [{ model: ResponseTeam, as: 'assignedTeam', attributes: ['id', 'name', 'type', 'status'] }],
    order: [['createdAt', 'DESC']],
    offset,
    limit: Number(limit),
  })

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

export const getIncident = expressAsyncHandler(async (req, res) => {
  const incident = await Incident.findByPk(req.params.id, { include: [{ model: ResponseTeam, as: 'assignedTeam' }] })
  if (!incident) throw new ApiError(404, 'Incident not found.')
  res.json({ incident })
})

export const createIncident = expressAsyncHandler(async (req, res) => {
  const count = await Incident.count()
  const incident = await Incident.create({
    ...req.body,
    incidentId: req.body.incidentId || `INC-${String(count + 1).padStart(4, '0')}`,
  })
  emitEvent('incident:created', { incident: incident.toJSON() })
  res.status(201).json({ incident })
})

export const updateIncident = expressAsyncHandler(async (req, res) => {
  const incident = await Incident.findByPk(req.params.id)
  if (!incident) throw new ApiError(404, 'Incident not found.')
  await incident.update(req.body)
  emitEvent('incident:updated', { incident: incident.toJSON() })
  res.json({ incident })
})

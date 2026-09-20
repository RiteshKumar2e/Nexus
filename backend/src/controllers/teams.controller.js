import expressAsyncHandler from 'express-async-handler'
import ResponseTeam from '../models/ResponseTeam.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'

export const listTeams = expressAsyncHandler(async (req, res) => {
  const { status, type } = req.query
  const where = {}
  if (status) where.status = status
  if (type) where.type = type
  const teams = await ResponseTeam.findAll({ where, order: [['name', 'ASC']] })
  res.json({ items: teams })
})

export const getTeam = expressAsyncHandler(async (req, res) => {
  const team = await ResponseTeam.findByPk(req.params.id)
  if (!team) throw new ApiError(404, 'Team not found.')
  res.json({ team })
})

export const updateTeam = expressAsyncHandler(async (req, res) => {
  const team = await ResponseTeam.findByPk(req.params.id)
  if (!team) throw new ApiError(404, 'Team not found.')
  await team.update(req.body)
  emitEvent('team:updated', { team: team.toJSON() })
  res.json({ team })
})

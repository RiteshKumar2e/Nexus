import expressAsyncHandler from 'express-async-handler'
import Road from '../models/Road.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'

export const listRoads = expressAsyncHandler(async (req, res) => {
  const roads = await Road.findAll({ order: [['roadId', 'ASC']] })
  res.json({ items: roads })
})

export const updateRoad = expressAsyncHandler(async (req, res) => {
  const road = await Road.findByPk(req.params.id)
  if (!road) throw new ApiError(404, 'Road not found.')
  await road.update(req.body)
  emitEvent('road:updated', { road: road.toJSON() })
  res.json({ road })
})

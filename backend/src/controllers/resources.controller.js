import expressAsyncHandler from 'express-async-handler'
import Resource from '../models/Resource.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'

export const listResources = expressAsyncHandler(async (req, res) => {
  const resources = await Resource.findAll({ order: [['category', 'ASC']] })
  res.json({ items: resources })
})

export const updateResource = expressAsyncHandler(async (req, res) => {
  const resource = await Resource.findByPk(req.params.id)
  if (!resource) throw new ApiError(404, 'Resource not found.')
  await resource.update(req.body)
  emitEvent('resource:updated', { resource: resource.toJSON() })
  res.json({ resource })
})

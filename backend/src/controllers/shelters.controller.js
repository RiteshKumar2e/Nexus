import expressAsyncHandler from 'express-async-handler'
import Shelter from '../models/Shelter.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'

export const listShelters = expressAsyncHandler(async (req, res) => {
  const shelters = await Shelter.findAll({ order: [['name', 'ASC']] })
  res.json({ items: shelters })
})

export const updateShelter = expressAsyncHandler(async (req, res) => {
  const shelter = await Shelter.findByPk(req.params.id)
  if (!shelter) throw new ApiError(404, 'Shelter not found.')
  await shelter.update(req.body)
  emitEvent('shelter:updated', { shelter: shelter.toJSON() })
  res.json({ shelter })
})

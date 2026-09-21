import expressAsyncHandler from 'express-async-handler'
import ReliefCamp from '../models/ReliefCamp.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'

export const listReliefCamps = expressAsyncHandler(async (req, res) => {
  const reliefCamps = await ReliefCamp.findAll({ order: [['name', 'ASC']] })
  res.json({ items: reliefCamps })
})

export const updateReliefCamp = expressAsyncHandler(async (req, res) => {
  const reliefCamp = await ReliefCamp.findByPk(req.params.id)
  if (!reliefCamp) throw new ApiError(404, 'Relief camp not found.')
  await reliefCamp.update(req.body)
  emitEvent('reliefCamp:updated', { reliefCamp: reliefCamp.toJSON() })
  res.json({ reliefCamp })
})

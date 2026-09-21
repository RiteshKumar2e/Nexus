import expressAsyncHandler from 'express-async-handler'
import CommunityKitchen from '../models/CommunityKitchen.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'

export const listCommunityKitchens = expressAsyncHandler(async (req, res) => {
  const kitchens = await CommunityKitchen.findAll({ order: [['name', 'ASC']] })
  res.json({ items: kitchens })
})

export const updateCommunityKitchen = expressAsyncHandler(async (req, res) => {
  const kitchen = await CommunityKitchen.findByPk(req.params.id)
  if (!kitchen) throw new ApiError(404, 'Community kitchen not found.')
  await kitchen.update(req.body)
  emitEvent('communityKitchen:updated', { communityKitchen: kitchen.toJSON() })
  res.json({ communityKitchen: kitchen })
})

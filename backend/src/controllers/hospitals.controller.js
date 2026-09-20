import expressAsyncHandler from 'express-async-handler'
import Hospital from '../models/Hospital.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'

export const listHospitals = expressAsyncHandler(async (req, res) => {
  const hospitals = await Hospital.findAll({ order: [['name', 'ASC']] })
  res.json({ items: hospitals })
})

export const updateHospital = expressAsyncHandler(async (req, res) => {
  const hospital = await Hospital.findByPk(req.params.id)
  if (!hospital) throw new ApiError(404, 'Hospital not found.')
  await hospital.update(req.body)
  emitEvent('hospital:updated', { hospital: hospital.toJSON() })
  res.json({ hospital })
})

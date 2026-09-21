import expressAsyncHandler from 'express-async-handler'
import MedicalUnit from '../models/MedicalUnit.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'

export const listMedicalUnits = expressAsyncHandler(async (req, res) => {
  const medicalUnits = await MedicalUnit.findAll({ order: [['name', 'ASC']] })
  res.json({ items: medicalUnits })
})

export const updateMedicalUnit = expressAsyncHandler(async (req, res) => {
  const medicalUnit = await MedicalUnit.findByPk(req.params.id)
  if (!medicalUnit) throw new ApiError(404, 'Medical unit not found.')
  await medicalUnit.update(req.body)
  emitEvent('medicalUnit:updated', { medicalUnit: medicalUnit.toJSON() })
  res.json({ medicalUnit })
})

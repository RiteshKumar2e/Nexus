import expressAsyncHandler from 'express-async-handler'
import { Op } from 'sequelize'
import District from '../models/District.js'
import Incident from '../models/Incident.js'
import ResponseTeam from '../models/ResponseTeam.js'
import MedicalUnit from '../models/MedicalUnit.js'
import ReliefCamp from '../models/ReliefCamp.js'
import Resource from '../models/Resource.js'
import CommunityKitchen from '../models/CommunityKitchen.js'
import ApiError from '../utils/ApiError.js'

export const listDistricts = expressAsyncHandler(async (req, res) => {
  const districts = await District.findAll({ order: [['name', 'ASC']] })
  res.json({ items: districts })
})

export const getDistrict = expressAsyncHandler(async (req, res) => {
  const district = await District.findByPk(req.params.id)
  if (!district) throw new ApiError(404, 'District not found.')

  const [incidents, teams, medicalUnits, reliefCamps, resources, communityKitchens] = await Promise.all([
    Incident.findAll({ where: { district: district.id, status: { [Op.ne]: 'RESOLVED' } }, order: [['severity', 'DESC']] }),
    ResponseTeam.findAll({ where: { location: district.id } }),
    MedicalUnit.findAll({ where: { district: district.id } }),
    ReliefCamp.findAll({ where: { district: district.id } }),
    Resource.findAll({ where: { region: district.id } }),
    CommunityKitchen.findAll({ where: { district: district.id } }),
  ])

  res.json({ district, incidents, teams, medicalUnits, reliefCamps, resources, communityKitchens })
})

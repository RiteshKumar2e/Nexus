import expressAsyncHandler from 'express-async-handler'
import ResponsePlan from '../models/ResponsePlan.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'

const INCLUDE = [
  { association: 'incident' },
  { association: 'actions', include: ['team', 'medicalUnit', 'reliefCamp'] },
]

export const listPlans = expressAsyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query
  const where = {}
  if (status) where.status = status
  const offset = (Number(page) - 1) * Number(limit)
  const { rows: items, count: total } = await ResponsePlan.findAndCountAll({
    where,
    include: INCLUDE,
    order: [['planNumber', 'DESC']],
    offset,
    limit: Number(limit),
    distinct: true,
  })
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

export const getPlan = expressAsyncHandler(async (req, res) => {
  const plan = await ResponsePlan.findByPk(req.params.id, { include: INCLUDE })
  if (!plan) throw new ApiError(404, 'Plan not found.')
  res.json({ plan })
})

export const approvePlan = expressAsyncHandler(async (req, res) => {
  const plan = await ResponsePlan.findByPk(req.params.id)
  if (!plan) throw new ApiError(404, 'Plan not found.')
  plan.status = 'EXECUTED'
  plan.approvedById = req.user.id
  await plan.save()
  emitEvent('plan:approved', { planId: plan.id, planNumber: plan.planNumber, approvedBy: req.user.name })
  res.json({ plan })
})

export const rejectPlan = expressAsyncHandler(async (req, res) => {
  const plan = await ResponsePlan.findByPk(req.params.id)
  if (!plan) throw new ApiError(404, 'Plan not found.')
  plan.status = 'REJECTED'
  await plan.save()
  emitEvent('plan:rejected', { planId: plan.id, planNumber: plan.planNumber, reason: req.body.reason, by: req.user.name })
  res.json({ plan })
})

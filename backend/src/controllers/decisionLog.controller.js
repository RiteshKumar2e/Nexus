import expressAsyncHandler from 'express-async-handler'
import { Op } from 'sequelize'
import DecisionLog from '../models/DecisionLog.js'
import ResponsePlan from '../models/ResponsePlan.js'

export const listDecisionLog = expressAsyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 25 } = req.query
  const where = {}
  if (status) where.status = status
  if (search) {
    where[Op.or] = [
      { trigger: { [Op.like]: `%${search}%` } },
      { decision: { [Op.like]: `%${search}%` } },
      { reason: { [Op.like]: `%${search}%` } },
    ]
  }
  const offset = (Number(page) - 1) * Number(limit)
  const { rows: items, count: total } = await DecisionLog.findAndCountAll({
    where,
    include: [{ model: ResponsePlan, as: 'relatedPlan', attributes: ['id', 'planNumber', 'status'] }],
    order: [['createdAt', 'DESC']],
    offset,
    limit: Number(limit),
  })
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

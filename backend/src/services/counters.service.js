import ResponsePlan from '../models/ResponsePlan.js'
import DecisionLog from '../models/DecisionLog.js'

export async function nextPlanNumber() {
  const last = await ResponsePlan.findOne({ order: [['planNumber', 'DESC']] })
  return (last?.planNumber || 0) + 1
}

export async function nextDecisionNumber() {
  const last = await DecisionLog.findOne({ order: [['decisionNumber', 'DESC']] })
  return (last?.decisionNumber || 0) + 1
}

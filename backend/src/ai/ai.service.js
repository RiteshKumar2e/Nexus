import Incident from '../models/Incident.js'
import ResponseTeam from '../models/ResponseTeam.js'
import MedicalUnit from '../models/MedicalUnit.js'
import ReliefCamp from '../models/ReliefCamp.js'
import Road from '../models/Road.js'
import ResponsePlan from '../models/ResponsePlan.js'
import DecisionLog from '../models/DecisionLog.js'
import { Op } from 'sequelize'
import { groqChat } from './groq.service.js'
import { geminiText, geminiAnalyzeImage } from './gemini.service.js'
import {
  SYSTEM_COPILOT,
  buildCopilotPrompt,
  SYSTEM_DECISION_EXPLAINER,
  buildDecisionExplainerPrompt,
  SYSTEM_IMAGE_ANALYSIS,
} from './prompts.js'

/**
 * Runs a text completion through Groq first (fast reasoning), then falls
 * back to Gemini, then to a deterministic canned response. The dashboard
 * must never break because an AI provider is unavailable.
 */
async function completeWithFallback(systemPrompt, userPrompt, fallbackText) {
  try {
    const result = await groqChat(systemPrompt, userPrompt)
    if (result) return { text: result, source: 'groq' }
  } catch (err) {
    console.warn('[ai] groq failed, falling back to gemini:', err.message)
  }
  try {
    const result = await geminiText(systemPrompt, userPrompt)
    if (result) return { text: result, source: 'gemini' }
  } catch (err) {
    console.warn('[ai] gemini failed, falling back to deterministic response:', err.message)
  }
  return { text: fallbackText, source: 'deterministic' }
}

async function gatherOperationalContext() {
  const [incidents, teams, medicalUnits, reliefCamps, roads, plans, decisions] = await Promise.all([
    Incident.findAll({ where: { status: { [Op.ne]: 'RESOLVED' } }, order: [['severity', 'DESC']], limit: 15 }),
    ResponseTeam.findAll({ limit: 20 }),
    MedicalUnit.findAll(),
    ReliefCamp.findAll(),
    Road.findAll(),
    ResponsePlan.findAll({ where: { status: 'ACTIVE' }, order: [['createdAt', 'DESC']], limit: 10 }),
    DecisionLog.findAll({ order: [['createdAt', 'DESC']], limit: 10 }),
  ])

  return {
    activeIncidents: incidents.map((i) => ({
      id: i.incidentId,
      type: i.type,
      severity: i.severity,
      district: i.district,
      status: i.status,
      populationImpact: i.populationImpact,
    })),
    teams: teams.map((t) => ({ name: t.name, type: t.type, agency: t.agency, status: t.status, district: t.currentAssignment?.district })),
    medicalUnits: medicalUnits.map((m) => ({ name: m.name, district: m.district, status: m.status, doctorsStatus: m.doctorsStatus, priorityCases: m.priorityCases })),
    reliefCamps: reliefCamps.map((c) => ({ name: c.name, district: c.district, capacityStatus: c.capacityStatus, status: c.status })),
    roads: roads.map((r) => ({ id: r.roadId, from: r.from, to: r.to, status: r.status })),
    activePlans: plans.map((p) => ({ planNumber: p.planNumber, trigger: p.trigger, status: p.status, estimatedImpact: p.estimatedImpact })),
    recentDecisions: decisions.map((d) => ({ decisionNumber: d.decisionNumber, trigger: d.trigger, decision: d.decision, result: d.result })),
    generatedAt: new Date().toISOString(),
  }
}

export async function answerCopilotQuery(question) {
  const context = await gatherOperationalContext()
  const criticalCount = context.activeIncidents.filter((i) => i.severity === 'CRITICAL').length
  const fallback = `Based on current data: ${context.activeIncidents.length} active incidents (${criticalCount} critical), ${
    context.activePlans.length
  } active response plans, and ${context.medicalUnits.filter((m) => m.status === 'CRITICAL').length} medical unit(s) at critical status. AI narrative generation is temporarily unavailable, but the underlying data above is live.`

  const { text, source } = await completeWithFallback(SYSTEM_COPILOT, buildCopilotPrompt(question, context), fallback)
  return { answer: text, source, context }
}

export async function explainDecision(decision) {
  try {
    const result = await completeWithFallback(
      SYSTEM_DECISION_EXPLAINER,
      buildDecisionExplainerPrompt(decision),
      null
    )
    return result.text
  } catch {
    return null
  }
}

export async function analyzeEvidenceImage(filePath, mimeType, contextText) {
  try {
    const text = await geminiAnalyzeImage(filePath, mimeType, SYSTEM_IMAGE_ANALYSIS, contextText)
    return { analysis: text, source: 'gemini' }
  } catch (err) {
    console.warn('[ai] gemini image analysis failed:', err.message)
    return {
      analysis: 'Automated image analysis is temporarily unavailable. Please assess the evidence manually and log findings in the incident record.',
      source: 'deterministic',
    }
  }
}

import expressAsyncHandler from 'express-async-handler'
import fs from 'fs'
import ApiError from '../utils/ApiError.js'
import { answerCopilotQuery, analyzeEvidenceImage } from '../ai/ai.service.js'
import Incident from '../models/Incident.js'

export const query = expressAsyncHandler(async (req, res) => {
  const { question } = req.body
  if (!question || !question.trim()) throw new ApiError(400, 'A question is required.')

  const { answer, source } = await answerCopilotQuery(question.trim())
  res.json({ answer, source })
})

export const analyze = expressAsyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'An image file is required.')

  const { incidentId } = req.body
  const { analysis, source } = await analyzeEvidenceImage(
    req.file.path,
    req.file.mimetype,
    incidentId ? `This photo is evidence for incident ${incidentId}.` : ''
  )

  if (incidentId) {
    const incident = await Incident.findByPk(incidentId)
    if (incident) {
      incident.evidence = [
        ...(incident.evidence || []),
        { url: `/uploads/${req.file.filename}`, uploadedAt: new Date(), aiAnalysis: analysis },
      ]
      incident.aiAssessment = analysis
      await incident.save()
    }
  }

  res.json({ analysis, source, fileUrl: `/uploads/${req.file.filename}` })
})

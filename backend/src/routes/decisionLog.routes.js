import { Router } from 'express'
import { listDecisionLog } from '../controllers/decisionLog.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listDecisionLog)

export default router

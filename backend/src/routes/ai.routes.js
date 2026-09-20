import { Router } from 'express'
import { query, analyze } from '../controllers/ai.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { aiLimiter } from '../middleware/rateLimiter.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.use(requireAuth)
router.post('/query', aiLimiter, query)
router.post('/analyze', aiLimiter, upload.single('image'), analyze)

export default router

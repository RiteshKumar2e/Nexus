import { Router } from 'express'
import { submitContact } from '../controllers/contact.controller.js'
import { contactLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/', contactLimiter, submitContact)

export default router
